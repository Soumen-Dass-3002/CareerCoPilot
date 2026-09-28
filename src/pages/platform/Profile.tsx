import { useState } from "react";
import PlatformShell from "./PlatformShell";
import { profileService } from "../../services/storage";

export default function Profile() {
  const [profile, setProfile] = useState(profileService.get());

  const save = (e) => {
    e.preventDefault();
    profileService.save({
      ...profile,
      skills:
        profile.skills?.split?.(",").map((x) => x.trim()).filter(Boolean) ||
        profile.skills,
      interests:
        profile.interests?.split?.(",").map((x) => x.trim()).filter(Boolean) ||
        profile.interests,
    });
    alert("Profile saved");
  };

  const FIELDS = [
    ["name", "Your name"],
    ["education", "Education level / qualification"],
    ["interests", "Interested fields (comma-separated)"],
    ["skills", "Skills (comma-separated)"],
    ["location", "Preferred location"],
    ["workMode", "Preferred work mode"],
  ];

  return (
    <PlatformShell
      eyebrow="Your Profile"
      title={<>Tell us only <em>what helps.</em></>}
      lede="You can skip anything you are not ready to share. Update your education, interests, skills, and preferences whenever you want."
    >
      <div style={{ padding: "32px 40px 60px", maxWidth: 560 }}>
        <form className="cc-form" onSubmit={save}>
          {FIELDS.map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                value={
                  Array.isArray(profile[key])
                    ? profile[key].join(", ")
                    : profile[key] || ""
                }
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                placeholder={key === "interests" ? "e.g. Technology, Design" : ""}
              />
            </label>
          ))}
          <button type="submit">Save my profile</button>
        </form>
      </div>
    </PlatformShell>
  );
}
