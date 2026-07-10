import ProfileSupport from "screens/ProfileSupport";

const sections = [
  { title: "Acceptance of Terms", body: "By accessing and using Flavry, you accept and agree to be bound by the terms and provision of this agreement." },
  { title: "Use of the App", body: "You agree to use the app only for lawful purposes and in accordance with these terms. You are responsible for your account activity." },
  { title: "Orders and Payments", body: "All orders are subject to availability. Prices are subject to change without notice. Payments must be made through our accepted methods." },
  { title: "Limitation of Liability", body: "Flavry shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services." },
  { title: "Changes to Terms", body: "We reserve the right to update these terms at any time. Continued use of the app constitutes acceptance of the changes." },
];

export default function TermsConditions() {
  return <ProfileSupport title="Terms & Conditions" icon="description" intro="Please read these terms and conditions carefully before using our app." sections={sections} />;
}
