import { useEffect, useState } from "react";
import UserAvatar from "../components/UserAvatar";
import Icon from "../components/Icon"


// Reusable password input used in the settings page
function PasswordField({ label, placeholder, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input placeholder={placeholder} type="password" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

// Settings page
// Lets users edit local profile information, upload a profile photo, and test password update UI
function SettingsPage({ profile, setProfile, isAuthenticated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profile);
  const [passwordDraft, setPasswordDraft] = useState({ current: "", next: "", confirm: "" });
  const [settingsMessage, setSettingsMessage] = useState("");
  const fields = [
    ["fullName", "Full Name"],
    ["email", "Email Address"],
    ["phoneNumber", "Phone Number"],
    ["location", "Location"]
  ];

  useEffect(() => {
    setProfileDraft(profile);
  }, [profile]);

  function updateDraft(field, value) {
    setProfileDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  }

  function saveProfile() {
    setProfile(profileDraft);
    setSettingsMessage("Profile saved in this browser only.");
    setIsEditing(false);
  }

  // Read selected image as a local preview and save it into the profile state
  function handlePhotoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSettingsMessage("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSettingsMessage("Image must be smaller than 5MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const nextProfile = { ...profile, ...profileDraft, photo: String(reader.result || "") };
      setProfileDraft(nextProfile);
      setProfile(nextProfile);
      setSettingsMessage("Photo saved locally in this browser.");
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  }

  // Prototype password update validation
  // This only updates local UI state until a backend is connected
  async function updatePassword(event) {
    event.preventDefault();
    if (!passwordDraft.current || !passwordDraft.next || !passwordDraft.confirm) {
      setSettingsMessage("Please fill in all password fields.");
      return;
    }
    if (passwordDraft.next.length < 6) {
      setSettingsMessage("New password must be at least 6 characters.");
      return;
    }
    if (passwordDraft.next !== passwordDraft.confirm) {
      setSettingsMessage("New passwords do not match.");
      return;
    }
    setPasswordDraft({ current: "", next: "", confirm: "" });
    setSettingsMessage("Demo only: no password is stored or transmitted.");
    
  }

  return (
      <section className="content narrow detail-stack">
        <div className="settings-header">
          <h2>Settings</h2>
          <p>Manage your account settings and preferences</p>
        </div>
        <article className="card settings-card">
          <h3>Profile Picture</h3>
          <div className="photo-row">
            <UserAvatar profile={profileDraft} size="large" />
            <div>
              <label className="btn dark photo-upload-button">
                <Icon name="camera" />
                Change Photo
                <input accept="image/*" type="file" onChange={handlePhotoUpload} />
              </label>
              <p className="meta-line" style={{ fontSize: 14, marginTop: 8 }}>
                JPG, PNG or GIF. Max size of 5MB.
              </p>
            </div>
          </div>
        </article>
        <article className="card settings-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
            <h3>Personal Information</h3>
            <button className="btn outline" type="button" onClick={() => (isEditing ? saveProfile() : setIsEditing(true))}>
              {isEditing ? "Save Profile" : "Edit Profile"}
            </button>
          </div>
          <div className="form-grid">
            {fields.map(([field, label]) => (
              <label className="field" key={field}>
                <span>{label}</span>
                <input value={profileDraft[field]} disabled={!isEditing} onChange={(event) => updateDraft(field, event.target.value)} />
              </label>
            ))}
          </div>
          <label className="field">
            <span>Bio</span>
            <textarea value={profileDraft.bio} disabled={!isEditing} onChange={(event) => updateDraft("bio", event.target.value)} />
          </label>
        </article>
        <form className="card settings-card" onSubmit={updatePassword}>
          <h3>
            <Icon name="lock" />
            Change Password
          </h3>
          <p className="meta-line" style={{ fontSize: 14 }}>
            Ensure your password is at least 6 characters long and includes a mix of letters, numbers, and symbols.
          </p>
          <div className="password-form">
            <PasswordField label="Current Password" placeholder="Enter current password" value={passwordDraft.current} onChange={(value) => setPasswordDraft({ ...passwordDraft, current: value })} />
            <PasswordField label="New Password" placeholder="Enter new password" value={passwordDraft.next} onChange={(value) => setPasswordDraft({ ...passwordDraft, next: value })} />
            <PasswordField label="Confirm New Password" placeholder="Confirm new password" value={passwordDraft.confirm} onChange={(value) => setPasswordDraft({ ...passwordDraft, confirm: value })} />
            <button className="btn dark full" type="submit">
              Update Password
            </button>
          </div>
          {settingsMessage && <p className="status-note">{settingsMessage}</p>}
        </form>
        <article className="card settings-card danger-card">
          <h3>Danger Zone</h3>
          <p className="meta-line" style={{ fontSize: 14 }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="btn danger full" type="button" onClick={() => setSettingsMessage("Account deletion is disabled until a backend is connected.")}>
            Delete Account
          </button>
        </article>
      </section>
  );
}
export default SettingsPage

