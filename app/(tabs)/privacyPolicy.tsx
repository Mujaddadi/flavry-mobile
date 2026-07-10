import ProfileSupport from "screens/ProfileSupport";

const sections = [
  { title: "Information We Collect", body: "We collect personal information that you provide to us, such as name, email address, phone number, and delivery address." },
  { title: "How We Use Information", body: "We use the information to process orders, improve our services, communicate with you, and personalize your experience." },
  { title: "Information Sharing", body: "We do not sell your personal information. We may share it with trusted service providers who help us operate our services." },
  { title: "Data Security", body: "We implement appropriate security measures to protect your personal information from unauthorized access or disclosure." },
  { title: "Your Rights", body: "You can access, update, or delete your personal information at any time." },
];

export default function PrivacyPolicy() {
  return <ProfileSupport title="Privacy Policy" icon="security" intro="Your privacy is important to us. This policy explains how we collect, use, and protect your personal information." sections={sections} />;
}
