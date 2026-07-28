import { NextResponse } from "next/server";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { getApprovedMember } from "../../../../lib/approvedMember";

const INK = "#171310";
const GOLD = "#C9A227";
const CREAM = "#FFFCF2";

const styles = StyleSheet.create({
  page: {
    backgroundColor: INK,
    padding: 18,
    fontFamily: "Helvetica",
  },
  card: {
    flex: 1,
    backgroundColor: CREAM,
    padding: 20,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brand: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: INK,
  },
  tagline: {
    fontSize: 6,
    color: INK,
    opacity: 0.6,
    marginTop: 2,
    maxWidth: 140,
  },
  badge: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#fff",
    backgroundColor: GOLD,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  photo: {
    width: 62,
    height: 62,
    borderRadius: 31,
    objectFit: "cover",
  },
  photoPlaceholder: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#F5F0EB",
  },
  name: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: INK,
  },
  meta: {
    fontSize: 8,
    color: INK,
    opacity: 0.65,
    marginTop: 3,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#E8E1D3",
    paddingTop: 10,
  },
  memberId: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
  },
  since: {
    fontSize: 7,
    color: INK,
    opacity: 0.55,
  },
});

export async function GET() {
  const member = await getApprovedMember();
  if (!member) {
    return NextResponse.json({ error: "Not authorized to download an ID card." }, { status: 403 });
  }

  const approvedYear = new Date(member.approved_at).getFullYear();

  const doc = (
    <Document title={`JSEC ID Card — ${member.full_name}`}>
      <Page size={[320, 200]} style={styles.page}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.brand}>JSEC</Text>
              <Text style={styles.tagline}>Jangid Sports & Education Committee, Nashik</Text>
            </View>
            <Text style={styles.badge}>MEMBER</Text>
          </View>

          <View style={styles.body}>
            {member.photoDataUri ? (
              // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image, not an HTML <img>
              <Image src={member.photoDataUri} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder} />
            )}
            <View>
              <Text style={styles.name}>{member.full_name}</Text>
              {member.gotra && <Text style={styles.meta}>Gotra: {member.gotra}</Text>}
              <Text style={styles.meta}>
                {member.city}, {member.state}
              </Text>
            </View>
          </View>

          <View style={styles.footerRow}>
            <View>
              <Text style={styles.memberId}>{member.member_id}</Text>
              <Text style={styles.since}>Lifetime Member since {approvedYear}</Text>
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
      "Content-Disposition": `attachment; filename="JSEC-ID-${member.member_id}.pdf"`,
    },
  });
}
