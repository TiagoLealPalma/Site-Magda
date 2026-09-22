import os

from django.conf import settings
from django.core.management.base import BaseCommand

from magda.models import Image


class Command(BaseCommand):
    help = (
        "Finds files in media/property_images/ that no Image row points to — "
        "left behind by deletes made before file cleanup was wired up (see "
        "Image's post_delete signal) — and reports or removes them. "
        "Safe to run anytime; a photo currently in use is never touched."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--apply', action='store_true',
            help='Delete the orphaned files. Without this flag, only reports what would be removed.',
        )

    def handle(self, *args, **options):
        media_dir = os.path.join(settings.MEDIA_ROOT, 'property_images')
        if not os.path.isdir(media_dir):
            self.stdout.write('No media/property_images directory here — nothing to do.')
            return

        referenced = {os.path.basename(name) for name in Image.objects.values_list('image', flat=True)}

        orphans = []
        for name in os.listdir(media_dir):
            path = os.path.join(media_dir, name)
            if os.path.isfile(path) and name not in referenced:
                orphans.append((name, os.path.getsize(path)))

        if not orphans:
            self.stdout.write(self.style.SUCCESS('No orphaned photos found.'))
            return

        total_bytes = sum(size for _, size in orphans)
        verb = 'Removing' if options['apply'] else 'Would remove'
        self.stdout.write(f'{verb} {len(orphans)} orphaned photo(s), {total_bytes / 1024 / 1024:.1f} MB:')
        for name, size in orphans:
            self.stdout.write(f'  {name}  ({size / 1024:.0f} KB)')
            if options['apply']:
                os.remove(os.path.join(media_dir, name))

        if options['apply']:
            self.stdout.write(self.style.SUCCESS(f'Freed {total_bytes / 1024 / 1024:.1f} MB.'))
        else:
            self.stdout.write('Run again with --apply to actually delete these.')
