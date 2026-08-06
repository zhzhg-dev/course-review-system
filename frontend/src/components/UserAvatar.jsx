import Icon from "./Icon"
// Displays the user's uploaded profile photo when available
// Falls back to a default icon if no photo exists
function UserAvatar({ profile, size = "", fallbackIcon = "user" }) {
  const className = `avatar ${size}`.trim();

  if (profile?.photo) {
    return (
      <span className={className}>
        <img alt={`${profile.fullName || "User"} avatar`} src={profile.photo} />
      </span>
    );
  }

  return (
    <span className={className}>
      <Icon name={fallbackIcon} />
    </span>
  );
}

export default UserAvatar
