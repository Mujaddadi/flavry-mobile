import ProfileSupport from "screens/ProfileSupport";

const sections = [
  { title: "Eligibility for Refund", body: "Refunds are applicable only for orders cancelled before preparation or when there are issues with the delivered order." },
  { title: "Refund Process", body: "To request a refund, go to Orders, select the order, and raise a refund request. Our team will review and respond within 24–48 hours." },
  { title: "Refund Timeline", body: "Once approved, refunds will be processed to your original payment method within 5–7 business days." },
  { title: "Non-Refundable Items", body: "Refunds are not applicable for completed orders or in case of a change of mind." },
];

export default function RefundPolicy() {
  return <ProfileSupport title="Refund Policy" icon="currency-exchange" intro="We want you to be satisfied with your experience. Please read our refund policy carefully." sections={sections} />;
}
