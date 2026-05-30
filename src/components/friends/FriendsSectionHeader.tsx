type FriendsSectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function FriendsSectionHeader({
  title,
  actionLabel = "Xem tất cả",
  onAction,
}: FriendsSectionHeaderProps) {
  const showAction = Boolean(onAction && actionLabel);

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      {showAction ? <span className="text-sm font-medium text-primary">{actionLabel}</span> : null}
    </div>
  );
}
