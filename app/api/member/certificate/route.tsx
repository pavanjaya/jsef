import { NextResponse } from "next/server";
import { Document, Page, View, Text, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { getApprovedMember } from "../../../../lib/approvedMember";

const NAVY = "#3D0B3D";
const ORANGE = "#FF6A00";
const CREAM = "#FFFEFA";

const styles = StyleSheet.create({
  page: {
    backgroundColor: NAVY,
    padding: 16,
    fontFamily: "Helvetica",
  },
  border: {
    flex: 1,
    borderWidth: 2,
    borderColor: ORANGE,
    padding: 10,
  },
  inner: {
    flex: 1,
    backgroundColor: CREAM,
    padding: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 9,
    color: NAVY,
    opacity: 0.55,
    marginTop: 4,
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    color: ORANGE,
    letterSpacing: 3,
    marginBottom: 28,
    textTransform: "uppercase",
  },
  bodyText: {
    fontSize: 11,
    color: NAVY,
    opacity: 0.75,
    marginBottom: 10,
  },
  name: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E8DEE6",
    minWidth: 320,
    textAlign: "center",
  },
  detailsText: {
    fontSize: 11,
    color: NAVY,
    opacity: 0.75,
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 420,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 44,
    paddingHorizontal: 20,
  },
  footerCol: {
    alignItems: "center",
    width: 140,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: NAVY,
    width: "100%",
    marginBottom: 4,
  },
  footerLabel: {
    fontSize: 8,
    color: NAVY,
    opacity: 0.6,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

export async function GET() {
  const member = await getApprovedMember();
  if (!member) {
    return NextResponse.json({ error: "Not authorized to download a certificate." }, { status: 403 });
  }

  const approvedDate = new Date(member.approved_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const doc = (
    <Document title={`JSEC Certificate of Membership — ${member.full_name}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.inner}>
            <Text style={styles.brand}>JSEC</Text>
            <Text style={styles.tagline}>Jangid Sports & Education Committee, Nashik</Text>

            <Text style={styles.title}>Certificate of Membership</Text>
            <Text style={styles.subtitle}>Lifetime Membership</Text>

            <Text style={styles.bodyText}>This certifies that</Text>
            <Text style={styles.name}>{member.full_name}</Text>
            <Text style={styles.detailsText}>
              is a Lifetime Member of the Jangid Sports & Education Committee, in recognition of their standing
              within the Jangid community of {member.city}, {member.state}.{"\n"}
              Member ID {member.member_id} · Approved {approvedDate}
            </Text>

            <View style={styles.footerRow}>
              <View style={styles.footerCol}>
                <View style={styles.signatureLine} />
                <Text style={styles.footerLabel}>President</Text>
              </View>
              <View style={styles.footerCol}>
                <View style={styles.signatureLine} />
                <Text style={styles.footerLabel}>Secretary</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="JSEC-Certificate-${member.member_id}.pdf"`,
    },
  });
}
