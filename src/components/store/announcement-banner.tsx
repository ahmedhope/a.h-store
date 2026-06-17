export function AnnouncementBanner({ settings }: { settings: Record<string, string> }) {
  if (settings.announcement_active !== "true" || !settings.announcement_text) return null;

  return (
    <div className={`bg-gradient-to-l ${settings.announcement_bg} ${settings.announcement_textColor} text-center text-sm py-2.5 px-4 font-medium`}>
      {settings.announcement_text}
    </div>
  );
}
