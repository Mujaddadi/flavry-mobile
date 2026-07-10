import MaterialIcons, { MaterialIconsIconName } from "@react-native-vector-icons/material-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";

type Section = { title: string; body: string };
export type ProfileSupportProps = {
  title: string;
  icon: MaterialIconsIconName;
  intro: string;
  sections?: Section[];
  faq?: boolean;
  contact?: boolean;
};

const FAQS = [
  ["How can I place an order?", "Browse restaurants, add items to your cart, and proceed to checkout."],
  ["What payment methods do you accept?", "Available payment methods are shown securely during checkout."],
  ["Can I modify or cancel my order?", "Open Orders and select an active order to see available actions."],
  ["How do I track my order?", "Your current order status is available from the Orders tab."],
  ["Do you offer refunds?", "Eligible orders can be submitted for review from the order details."],
  ["How can I contact customer support?", "Use Contact Us to reach our support team."],
];

const ProfileSupport = ({ title, icon, intro, sections = [], faq, contact }: ProfileSupportProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.navigate("/(tabs)/profile")} accessibilityRole="button" accessibilityLabel="Go back to profile">
          <MaterialIcons name="arrow-back" size={25} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <MaterialIcons name={icon} size={70} color="rgba(255,255,255,0.55)" style={styles.heroIcon} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}>
        {faq && <TextInput style={styles.search} placeholder="Search questions..." placeholderTextColor={Colors.gray3} />}
        {!faq && !contact && <Text style={styles.updated}>Last updated: 20 May 2024</Text>}
        <View style={styles.introCard}>
          <View style={styles.iconBubble}><MaterialIcons name={icon} size={25} color={Colors.primary} /></View>
          <Text style={styles.intro}>{intro}</Text>
        </View>
        {faq && <Text style={styles.sectionHeading}>Popular Questions</Text>}
        {faq && FAQS.map(([question, answer], index) => (
          <Pressable key={question} style={styles.faqCard} onPress={() => setOpen(open === index ? null : index)}>
            <View style={styles.faqRow}><Text style={styles.faqTitle}>{question}</Text><MaterialIcons name={open === index ? "expand-less" : "expand-more"} size={22} color={Colors.gray2} /></View>
            {open === index && <Text style={styles.body}>{answer}</Text>}
          </Pressable>
        ))}
        {sections.map((section, index) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{index + 1}. {section.title}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}
        {contact && <ContactContent onFaq={() => router.push("/(tabs)/faq")} />}
      </ScrollView>
    </View>
  );
};

const ContactContent = ({ onFaq }: { onFaq: () => void }) => (
  <View>
    <Text style={styles.sectionHeading}>Get in touch</Text>
    {[["email", "Email", "support@flavry.app"], ["phone", "Phone", "+92 300 1234567"], ["place", "Address", "Nuijavuori 2 G 45, Espoo, Finland"], ["schedule", "Business Hours", "Mon – Sun: 9:00 AM – 11:00 PM"]].map(([icon, label, value]) => (
      <View style={styles.contactRow} key={label}><View style={styles.iconBubble}><MaterialIcons name={icon as MaterialIconsIconName} size={21} color={Colors.primary} /></View><View style={styles.contactText}><Text style={styles.faqTitle}>{label}</Text><Text style={styles.body}>{value}</Text></View><MaterialIcons name="chevron-right" size={22} color={Colors.gray2} /></View>
    ))}
    <Pressable style={styles.introCard} onPress={onFaq} accessibilityRole="button" accessibilityLabel="Go to FAQ"><MaterialIcons name="help-outline" size={26} color={Colors.primary} /><View style={styles.contactText}><Text style={styles.faqTitle}>Frequently Asked Questions</Text><Text style={styles.body}>Check our FAQ section for quick answers.</Text><Text style={styles.link}>Go to FAQ</Text></View></Pressable>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  header: { height: 128, backgroundColor: Colors.primary, flexDirection: "row", alignItems: "center", gap: Spacing.lg, paddingHorizontal: Spacing.reg, overflow: "hidden" },
  headerTitle: { color: Colors.white, fontSize: FontSizes.xl, fontWeight: "700", zIndex: 1 },
  heroIcon: { position: "absolute", right: 12, bottom: -7 },
  content: { flexGrow: 1, backgroundColor: Colors.background, padding: Spacing.reg },
  updated: { color: Colors.gray2, fontSize: FontSizes.sm, marginBottom: Spacing.reg },
  search: { height: 46, borderRadius: 10, borderWidth: 1, borderColor: Colors.gray5, backgroundColor: Colors.white, paddingHorizontal: Spacing.reg, marginBottom: Spacing.lg },
  introCard: { flexDirection: "row", alignItems: "center", gap: Spacing.reg, padding: Spacing.lg, borderRadius: 10, backgroundColor: Colors.primaryLight, marginBottom: Spacing.xl },
  intro: { flex: 1, color: Colors.gray2, fontSize: FontSizes.sm, lineHeight: 21 },
  iconBubble: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: Colors.primaryLight },
  sectionHeading: { fontSize: FontSizes.md, fontWeight: "700", marginBottom: Spacing.md, color: Colors.black2 },
  section: { marginBottom: Spacing.xl, paddingHorizontal: Spacing.sm },
  sectionTitle: { color: Colors.black2, fontSize: FontSizes.md, fontWeight: "700", marginBottom: Spacing.sm },
  body: { color: Colors.gray2, fontSize: FontSizes.sm, lineHeight: 21 },
  faqCard: { backgroundColor: Colors.white, borderRadius: 10, borderWidth: 1, borderColor: "#EEE9E6", padding: Spacing.reg, marginBottom: Spacing.sm },
  faqRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: Spacing.sm },
  faqTitle: { flex: 1, color: Colors.black2, fontSize: FontSizes.sm, fontWeight: "600" },
  contactRow: { flexDirection: "row", alignItems: "center", paddingVertical: Spacing.reg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray5 },
  contactText: { flex: 1, marginLeft: Spacing.md },
  link: { color: Colors.primary, fontSize: FontSizes.sm, fontWeight: "700", marginTop: Spacing.md },
});

export default ProfileSupport;
