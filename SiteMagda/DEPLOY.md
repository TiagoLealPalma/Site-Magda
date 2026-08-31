# Deploy no VPS

Guia para pôr este site a correr no VPS via Docker, e depois manter isso
automático a cada push no branch `deploy`.

## 0. Desligar o site antigo

O VPS já tem a versão antiga (Django-templates) a correr, provavelmente via
nginx do sistema + gunicorn/runserver como serviço systemd. Antes de avançar:

```bash
# ver o que está a ocupar as portas 80/443 hoje
sudo ss -tlnp | grep -E ':80|:443'
sudo systemctl status nginx

# parar e desativar o que encontrares a servir o site antigo, por exemplo:
sudo systemctl stop nginx
sudo systemctl disable nginx
sudo systemctl stop <nome-do-serviço-gunicorn-antigo>
sudo systemctl disable <nome-do-serviço-gunicorn-antigo>
```

**Não apagues** `/etc/letsencrypt/` — vamos reaproveitar o certificado que já
lá está.

## 1. Instalar Docker no VPS

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# sai e volta a entrar em SSH para o grupo fazer efeito
docker compose version   # confirma que o plugin compose está incluído
```

## 2. Clonar o repositório

```bash
git clone https://github.com/TiagoLealPalma/Site-Magda.git
cd Site-Magda
git checkout deploy
cd SiteMagda
```

Se o repo for privado, vais precisar de uma chave SSH de deploy com acesso de
leitura ao repo (`git@github.com:...` em vez de `https://`) — ou de um
[personal access token](https://github.com/settings/tokens).

## 3. Configurar o `.env`

```bash
cp .env.example .env
nano .env
```

Preenche `SECRET_KEY` (gera com `python3 -c "import secrets; print(secrets.token_urlsafe(50))"`),
`ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS` e `DOMAIN` com o domínio real. Deixa
`ENABLE_SSL=false` para já.

## 4. Primeiro deploy (sem SSL, para validar)

```bash
./deploy.sh
```

Confirma em `http://<IP-do-VPS>` que o site carrega, a API responde
(`/api/properties/`), e o admin/backoffice funcionam.

## 5. Ligar HTTPS (reaproveitando o certificado existente)

Confirma que o certificado do domínio ainda existe:

```bash
sudo ls /etc/letsencrypt/live/$DOMAIN/
```

Se existir `fullchain.pem` e `privkey.pem`, edita o `.env` e muda:

```
ENABLE_SSL=true
```

E volta a fazer deploy:

```bash
./deploy.sh
```

Confirma `https://<o-teu-domínio>` no browser.

### Manter a renovação automática a funcionar

O certbot que já corre no VPS (verifica com `sudo systemctl list-timers | grep certbot`)
provavelmente tem um *deploy hook* a recarregar o nginx do sistema — que já
não existe. Edita a configuração de renovação (normalmente em
`/etc/letsencrypt/renewal/$DOMAIN.conf`) e garante que o `renew_hook` passa a
ser:

```
renew_hook = docker compose -f /caminho/completo/para/Site-Magda/SiteMagda/docker-compose.yml exec nginx nginx -s reload
```

Testa com `sudo certbot renew --dry-run`.

## 6. Deploy automático (GitHub Actions)

Sempre que fizeres `git push origin deploy`, um workflow no GitHub liga-se ao
VPS por SSH e corre `deploy.sh` — sem precisares de entrar manualmente.

### 6.1. Criar uma chave SSH só para isto

No teu computador (não no VPS):

```bash
ssh-keygen -t ed25519 -f deploy_key -N ""
```

Isto cria `deploy_key` (privada) e `deploy_key.pub` (pública).

### 6.2. Autorizar a chave no VPS

```bash
cat deploy_key.pub | ssh <utilizador>@<vps> "cat >> ~/.ssh/authorized_keys"
```

(Idealmente usa um utilizador dedicado, não `root`, que esteja no grupo
`docker` e tenha a pasta do projeto acessível.)

### 6.3. Adicionar os secrets no GitHub

No repositório: `Settings → Secrets and variables → Actions → New repository secret`.
Cria estes quatro:

| Nome | Valor |
|---|---|
| `VPS_HOST` | IP ou domínio do VPS |
| `VPS_USER` | o utilizador SSH usado no passo 6.2 |
| `VPS_SSH_KEY` | conteúdo completo do ficheiro `deploy_key` (a chave **privada**) |
| `VPS_PROJECT_PATH` | caminho absoluto no VPS até `SiteMagda`, ex: `/home/deploy/Site-Magda/SiteMagda` |

Depois disto, qualquer `git push origin deploy` dispara o deploy sozinho —
acompanha em `Actions` no GitHub.

## Comandos úteis

```bash
docker compose logs -f web       # logs do Django
docker compose logs -f nginx     # logs do nginx
docker compose exec web python manage.py createsuperuser
docker compose down              # parar tudo (mantém os volumes/dados)
```
