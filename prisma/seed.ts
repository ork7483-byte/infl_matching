import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  "뷰티",
  "패션",
  "푸드",
  "여행",
  "테크",
  "라이프스타일",
  "피트니스",
  "육아",
];

const KOREAN_NAMES = [
  "김지수",
  "이서연",
  "박민준",
  "최유진",
  "정하은",
  "강도윤",
  "조은서",
  "윤시우",
  "임지아",
  "한수빈",
  "오채원",
  "서준혁",
  "신예은",
  "권나윤",
  "황태현",
  "송지현",
  "배승우",
  "류하린",
  "문서준",
  "장다은",
  "안소율",
  "홍민서",
  "전유나",
  "고시현",
  "남지원",
  "유하영",
  "노승민",
  "하은채",
  "양서윤",
  "주민지",
];

const USERNAMES = [
  "beauty_jisoo",
  "soyeon_style",
  "minjun_eats",
  "yujin_travel",
  "haeun_tech",
  "doyun_life",
  "eunseo_beauty",
  "siwoo_fashion",
  "jia_foodie",
  "subin_daily",
  "chaewon_fit",
  "junhyuk_review",
  "yeeun_glam",
  "nayoon_ootd",
  "taehyun_gadget",
  "jihyun_mom",
  "seungwoo_gym",
  "harin_vlog",
  "seojun_cook",
  "daeun_travel",
  "soyul_beauty",
  "minseo_fashion",
  "yuna_lifestyle",
  "sihyun_foodie",
  "jiwon_tech",
  "hayoung_fit",
  "seungmin_daily",
  "eunchae_beauty",
  "seoyoon_style",
  "minji_mom",
];

const BIOS = [
  "뷰티 크리에이터 💄 | 매일 메이크업 & 스킨케어 팁 | 협업 DM",
  "패션 & 라이프스타일 🌿 | 일상을 아름답게 | Seoul",
  "맛집 탐방 🍽️ | 서울·경기 맛집 리뷰어 | 협찬 문의 DM",
  "여행하는 사람 ✈️ | 국내외 여행 브이로그 | 포토그래퍼",
  "테크 리뷰어 📱 | 최신 가젯·앱 리뷰 | IT 트렌드",
  "소소한 일상 공유 🌸 | 인테리어·카페·취미 | 일상 기록",
  "뷰티 인플루언서 💋 | 코스메틱 리뷰 전문 | PR 환영",
  "스타일리스트 👗 | 데일리룩 & 쇼핑 하울 | Brand collab",
  "홈쿡 & 레시피 🥘 | 간단한 집밥 요리 | 식재료 협찬 가능",
  "피트니스 & 건강 💪 | 홈트레이닝 루틴 | 운동 브이로그",
];

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pickRandom<T>(arr: T[], count = 1): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateFollowerCount(): number {
  const ranges = [
    { min: 1000, max: 5000, weight: 5 },
    { min: 5000, max: 20000, weight: 8 },
    { min: 20000, max: 50000, weight: 6 },
    { min: 50000, max: 100000, weight: 5 },
    { min: 100000, max: 300000, weight: 3 },
    { min: 300000, max: 500000, weight: 2 },
  ];
  const totalWeight = ranges.reduce((sum, r) => sum + r.weight, 0);
  let random = Math.random() * totalWeight;
  for (const range of ranges) {
    random -= range.weight;
    if (random <= 0) return rand(range.min, range.max);
  }
  return rand(1000, 50000);
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.creditPurchase.deleteMany();
  await prisma.creditBalance.deleteMany();
  await prisma.aIGeneration.deleteMany();
  await prisma.aIModel.deleteMany();
  await prisma.review.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.postPerformanceSnapshot.deleteMany();
  await prisma.campaignPost.deleteMany();
  await prisma.campaignApplication.deleteMany();
  await prisma.campaignInfluencer.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.pricePrediction.deleteMany();
  await prisma.aqsScore.deleteMany();
  await prisma.audienceDemographic.deleteMany();
  await prisma.mediaSnapshot.deleteMany();
  await prisma.followerHistory.deleteMany();
  await prisma.influencer.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.pageVisit.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);

  // ============================================
  // Create Admin User
  // ============================================
  await prisma.user.create({
    data: {
      email: "ork7483@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      name: "관리자",
      plan: "PRO",
    },
  });
  console.log("✅ Created admin user (ork7483@gmail.com)");

  // ============================================
  // Create Brand Users & Brands
  // ============================================
  const brandCompanies = [
    { name: "글로우업 코스메틱", industry: "뷰티", website: "https://glowup.kr" },
    { name: "스타일런 패션", industry: "패션", website: "https://stylerun.kr" },
    { name: "딜리셔스 푸드", industry: "푸드", website: "https://delicious.kr" },
    { name: "테크노바 전자", industry: "테크", website: "https://technova.kr" },
    { name: "피트라이프 헬스", industry: "피트니스", website: "https://fitlife.kr" },
  ];

  const brands = [];
  for (let i = 0; i < brandCompanies.length; i++) {
    const user = await prisma.user.create({
      data: {
        email: `brand${i + 1}@test.com`,
        password: hashedPassword,
        role: "BRAND",
        name: `${brandCompanies[i].name} 담당자`,
      },
    });
    const brand = await prisma.brand.create({
      data: {
        userId: user.id,
        companyName: brandCompanies[i].name,
        industry: brandCompanies[i].industry,
        website: brandCompanies[i].website,
      },
    });
    brands.push(brand);
  }
  console.log(`✅ Created ${brands.length} brands`);

  // ============================================
  // Create 30 Influencers
  // ============================================
  const influencers = [];
  for (let i = 0; i < 30; i++) {
    const followersCount = generateFollowerCount();
    const followingCount = rand(
      Math.floor(followersCount * 0.05),
      Math.floor(followersCount * 0.4)
    );
    const mediaCount = rand(50, 800);
    const categories = pickRandom(CATEGORIES, rand(1, 3));
    const avgEngagementRate = randFloat(0.5, 12);

    // Create some as registered users (first 5)
    let userId: string | undefined;
    if (i < 5) {
      const user = await prisma.user.create({
        data: {
          email: `creator${i + 1}@test.com`,
          password: hashedPassword,
          role: "CREATOR",
          name: KOREAN_NAMES[i],
        },
      });
      userId = user.id;
    }

    const influencer = await prisma.influencer.create({
      data: {
        userId,
        username: USERNAMES[i],
        fullName: KOREAN_NAMES[i],
        biography: BIOS[i % BIOS.length],
        profilePicUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${USERNAMES[i]}`,
        followersCount,
        followingCount,
        mediaCount,
        categories,
        avgEngagementRate,
        isOauthConnected: i < 5,
      },
    });
    influencers.push(influencer);
  }
  console.log(`✅ Created ${influencers.length} influencers`);

  // ============================================
  // Follower History (90 days for each influencer)
  // ============================================
  const now = new Date();
  for (const inf of influencers) {
    const histories = [];
    let currentFollowers = inf.followersCount;
    for (let day = 90; day >= 0; day--) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(0, 0, 0, 0);

      // Simulate organic growth with some noise
      const dailyChange = Math.floor(
        currentFollowers * randFloat(-0.005, 0.015)
      );
      currentFollowers = Math.max(
        100,
        day === 0 ? inf.followersCount : currentFollowers + dailyChange
      );

      histories.push({
        influencerId: inf.id,
        followersCount: currentFollowers,
        followingCount:
          inf.followingCount + rand(-10, 10),
        mediaCount: inf.mediaCount - Math.floor(day * 0.3),
        recordedDate: date,
      });
    }
    await prisma.followerHistory.createMany({ data: histories });
  }
  console.log("✅ Created follower history (90 days x 30 influencers)");

  // ============================================
  // Media Snapshots (24 posts per influencer)
  // ============================================
  const mediaTypes = ["IMAGE", "VIDEO", "CAROUSEL_ALBUM", "REEL"] as const;
  const captions = [
    "오늘의 #OOTD 🌟 너무 좋아하는 컬러 조합이에요!",
    "새로운 스킨케어 루틴 공유합니다 ✨ #뷰티팁",
    "이 맛집 진짜 대박... 재방문 확정 🍜 #맛집추천",
    "집에서 할 수 있는 15분 운동 루틴 💪 #홈트",
    "오늘의 언박싱! 기대했던 제품이에요 📦",
    "주말 카페 투어 ☕ 분위기 최고인 곳 찾았어요",
    "최신 가젯 리뷰! 솔직 후기 드려요 📱 #테크리뷰",
    "오늘의 메이크업 룩 💄 자연스러운 데일리 메이크업",
  ];

  for (const inf of influencers) {
    const snapshots = [];
    for (let j = 0; j < 24; j++) {
      const postedAt = new Date(now);
      postedAt.setDate(postedAt.getDate() - rand(1, 90));
      const likeCount = Math.floor(
        inf.followersCount * randFloat(0.01, 0.1)
      );
      const commentsCount = Math.floor(likeCount * randFloat(0.02, 0.15));

      snapshots.push({
        influencerId: inf.id,
        igMediaId: `media_${inf.username}_${j}`,
        mediaType: mediaTypes[rand(0, mediaTypes.length - 1)],
        caption: captions[j % captions.length],
        likeCount,
        commentsCount,
        reach: Math.floor(inf.followersCount * randFloat(0.3, 1.2)),
        impressions: Math.floor(inf.followersCount * randFloat(0.5, 2.0)),
        saved: Math.floor(likeCount * randFloat(0.05, 0.2)),
        shares: Math.floor(likeCount * randFloat(0.01, 0.08)),
        permalink: `https://instagram.com/p/fake_${inf.username}_${j}`,
        thumbnailUrl: `https://picsum.photos/seed/${inf.username}${j}/400/400`,
        postedAt,
      });
    }
    await prisma.mediaSnapshot.createMany({ data: snapshots });
  }
  console.log("✅ Created media snapshots (24 x 30 influencers)");

  // ============================================
  // Audience Demographics (first 10 influencers)
  // ============================================
  for (let i = 0; i < 10; i++) {
    const inf = influencers[i];
    const demographics = [
      // Gender
      { breakdownType: "gender", breakdownKey: "female", value: randFloat(40, 75) },
      { breakdownType: "gender", breakdownKey: "male", value: 0 },
      // Age
      { breakdownType: "age", breakdownKey: "13-17", value: randFloat(3, 10) },
      { breakdownType: "age", breakdownKey: "18-24", value: randFloat(20, 40) },
      { breakdownType: "age", breakdownKey: "25-34", value: randFloat(25, 45) },
      { breakdownType: "age", breakdownKey: "35-44", value: randFloat(10, 20) },
      { breakdownType: "age", breakdownKey: "45-54", value: randFloat(3, 10) },
      { breakdownType: "age", breakdownKey: "55+", value: randFloat(1, 5) },
      // City
      { breakdownType: "city", breakdownKey: "서울", value: randFloat(30, 55) },
      { breakdownType: "city", breakdownKey: "부산", value: randFloat(5, 15) },
      { breakdownType: "city", breakdownKey: "인천", value: randFloat(3, 10) },
      { breakdownType: "city", breakdownKey: "대구", value: randFloat(3, 8) },
      { breakdownType: "city", breakdownKey: "대전", value: randFloat(2, 6) },
      // Country
      { breakdownType: "country", breakdownKey: "KR", value: randFloat(70, 92) },
      { breakdownType: "country", breakdownKey: "JP", value: randFloat(2, 8) },
      { breakdownType: "country", breakdownKey: "US", value: randFloat(1, 5) },
    ];

    // Fix gender percentages
    demographics[1].value = parseFloat(
      (100 - demographics[0].value).toFixed(2)
    );

    await prisma.audienceDemographic.createMany({
      data: demographics.map((d) => ({
        influencerId: inf.id,
        ...d,
      })),
    });
  }
  console.log("✅ Created audience demographics (10 influencers)");

  // ============================================
  // AQS Scores (all 30 influencers)
  // ============================================
  for (const inf of influencers) {
    const engagement = randFloat(5, 19);
    const growth = randFloat(5, 19);
    const ratio = randFloat(5, 19);
    const consistency = randFloat(5, 19);
    const authenticity = randFloat(5, 19);
    const total = parseFloat(
      (engagement + growth + ratio + consistency + authenticity).toFixed(1)
    );

    const signals = [];
    if (inf.avgEngagementRate && inf.avgEngagementRate < 1)
      signals.push("낮은 참여율");
    if (inf.followingCount > inf.followersCount * 0.5)
      signals.push("팔로잉/팔로워 비율 높음");
    if (engagement < 10) signals.push("참여 품질 낮음");

    await prisma.aqsScore.create({
      data: {
        influencerId: inf.id,
        totalScore: Math.min(total, 100),
        // 4-axis v2 required fields (seeded with legacy values as approximations)
        engagementAuthenticity: engagement,
        audienceQuality: growth,
        contentConsistency: consistency,
        commentQuality: authenticity,
        // backward-compat optional fields
        engagementQuality: engagement,
        growthPattern: growth,
        ratioAnalysis: ratio,
        commentAuthenticity: authenticity,
        signals,
        modelVersion: "rule-v1",
      },
    });
  }
  console.log("✅ Created AQS scores (30 influencers)");

  // ============================================
  // Price Predictions (all 30 influencers)
  // ============================================
  const categoryPriceMultiplier: Record<string, number> = {
    뷰티: 20,
    패션: 16,
    푸드: 14,
    여행: 15,
    테크: 13,
    라이프스타일: 11,
    피트니스: 12,
    육아: 10,
  };

  for (const inf of influencers) {
    const baseMult =
      categoryPriceMultiplier[inf.categories[0]] || 12;
    const basePrice = inf.followersCount * baseMult;
    const erMult =
      (inf.avgEngagementRate || 3) > 3
        ? 1.2
        : (inf.avgEngagementRate || 3) < 1
        ? 0.7
        : 1.0;
    const adjustedPrice = Math.floor(basePrice * erMult);

    for (const contentType of ["FEED", "REEL", "STORY"]) {
      const typeMult =
        contentType === "REEL" ? 1.3 : contentType === "STORY" ? 0.5 : 1.0;
      const fee = Math.floor(adjustedPrice * typeMult);
      const predictedReach = Math.floor(
        inf.followersCount * randFloat(0.3, 0.8)
      );
      const predictedLikes = Math.floor(predictedReach * randFloat(0.03, 0.1));
      const predictedComments = Math.floor(
        predictedLikes * randFloat(0.02, 0.1)
      );

      await prisma.pricePrediction.create({
        data: {
          influencerId: inf.id,
          predictedFeeMin: Math.floor(fee * 0.8),
          predictedFeeMax: Math.floor(fee * 1.2),
          predictedReach,
          predictedLikes,
          predictedComments,
          predictedEngagementRate: randFloat(1, 8),
          predictedCpr: parseFloat((fee / predictedReach).toFixed(2)),
          predictedCpe: parseFloat(
            (fee / (predictedLikes + predictedComments)).toFixed(2)
          ),
          contentType,
          modelVersion: "rule-v1",
          confidenceScore: randFloat(0.6, 0.95),
        },
      });
    }
  }
  console.log("✅ Created price predictions (30 influencers x 3 types)");

  // ============================================
  // Campaigns (3 campaigns)
  // ============================================
  const campaignData = [
    {
      brandIndex: 0,
      name: "글로우업 봄 신상 캠페인",
      description: "2024 S/S 신상 립스틱 라인 홍보 캠페인",
      hashtag: "#글로우업봄신상",
      contentType: "REEL",
      budget: 5000000,
      status: "ACTIVE" as const,
      isPublic: true,
      category: "뷰티",
      rewardType: "PAID" as const,
      rewardAmount: 500000,
      requirements: "팔로워 10,000명 이상, 뷰티 카테고리",
      influencerCount: 5,
    },
    {
      brandIndex: 1,
      name: "스타일런 여름 룩북",
      description: "여름 신상 컬렉션 스타일링 콘텐츠 제작",
      hashtag: "#스타일런룩북",
      contentType: "FEED",
      budget: 3000000,
      status: "ACTIVE" as const,
      isPublic: true,
      category: "패션",
      rewardType: "MIXED" as const,
      rewardAmount: 300000,
      requirements: "패션 카테고리, 참여율 3% 이상",
      influencerCount: 4,
    },
    {
      brandIndex: 2,
      name: "딜리셔스 맛집 투어",
      description: "서울 핫플 맛집 리뷰 캠페인",
      hashtag: "#딜리셔스맛집",
      contentType: "ANY",
      budget: 2000000,
      status: "COMPLETED" as const,
      isPublic: false,
      category: "푸드",
      rewardType: "PRODUCT" as const,
      rewardAmount: 100000,
      requirements: "푸드 카테고리",
      influencerCount: 3,
    },
  ];

  const campaigns = [];
  for (const cd of campaignData) {
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - rand(30, 60));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    const campaign = await prisma.campaign.create({
      data: {
        brandId: brands[cd.brandIndex].id,
        name: cd.name,
        description: cd.description,
        hashtag: cd.hashtag,
        contentType: cd.contentType,
        budget: cd.budget,
        startDate,
        endDate,
        status: cd.status,
        isPublic: cd.isPublic,
        category: cd.category,
        rewardType: cd.rewardType,
        rewardAmount: cd.rewardAmount,
        requirements: cd.requirements,
      },
    });
    campaigns.push({ ...campaign, influencerCount: cd.influencerCount });
  }
  console.log(`✅ Created ${campaigns.length} campaigns`);

  // ============================================
  // Campaign-Influencer assignments
  // ============================================
  const campaignInfluencers = [];
  for (const campaign of campaigns) {
    const assigned = pickRandom(influencers, campaign.influencerCount);
    for (const inf of assigned) {
      const ci = await prisma.campaignInfluencer.create({
        data: {
          campaignId: campaign.id,
          influencerId: inf.id,
          agreedFee: rand(200000, 800000),
          status: campaign.status === "COMPLETED" ? "COMPLETED" : "ACCEPTED",
          acceptedAt: new Date(),
          completedAt:
            campaign.status === "COMPLETED" ? new Date() : undefined,
        },
      });
      campaignInfluencers.push(ci);
    }
  }
  console.log(`✅ Created ${campaignInfluencers.length} campaign-influencer assignments`);

  // ============================================
  // Campaign Posts (10 total) + Performance Snapshots
  // ============================================
  let postCount = 0;
  for (const ci of campaignInfluencers.slice(0, 10)) {
    const postedAt = new Date(now);
    postedAt.setDate(postedAt.getDate() - rand(5, 25));

    const post = await prisma.campaignPost.create({
      data: {
        campaignId: ci.campaignId,
        influencerId: ci.influencerId,
        igMediaId: `campaign_post_${postCount}`,
        permalink: `https://instagram.com/p/campaign_${postCount}`,
        postedAt,
      },
    });

    // 5 performance snapshots per post (time-series)
    const intervals = [1, 6, 24, 48, 168]; // hours
    let cumulativeLikes = 0;
    let cumulativeComments = 0;
    for (const hours of intervals) {
      const snapshotAt = new Date(postedAt);
      snapshotAt.setHours(snapshotAt.getHours() + hours);
      cumulativeLikes += rand(100, 2000);
      cumulativeComments += rand(10, 200);
      const reach = rand(5000, 50000);

      await prisma.postPerformanceSnapshot.create({
        data: {
          campaignPostId: post.id,
          likeCount: cumulativeLikes,
          commentsCount: cumulativeComments,
          reach,
          impressions: Math.floor(reach * randFloat(1.2, 2.0)),
          saved: rand(50, 500),
          shares: rand(10, 100),
          engagementRate: randFloat(1, 10),
          snapshotAt,
        },
      });
    }
    postCount++;
  }
  console.log(`✅ Created ${postCount} campaign posts with performance snapshots`);

  // ============================================
  // Campaign Applications (5)
  // ============================================
  const availableInfluencers = influencers.slice(15, 20);
  for (let i = 0; i < 5; i++) {
    const campIdx = i < 2 ? 0 : i < 4 ? 1 : 2;
    await prisma.campaignApplication.create({
      data: {
        campaignId: campaigns[campIdx].id,
        influencerId: availableInfluencers[i].id,
        message: "안녕하세요! 이 캠페인에 관심이 있어 지원합니다.",
        expectedReach: rand(10000, 50000),
        status: i < 2 ? "ACCEPTED" : i < 4 ? "PENDING" : "REJECTED",
        reviewedAt: i !== 3 ? new Date() : undefined,
      },
    });
  }
  console.log("✅ Created 5 campaign applications");

  // ============================================
  // Payments (5)
  // ============================================
  const paymentStatuses = [
    "COMPLETED",
    "COMPLETED",
    "PROCESSING",
    "PENDING",
    "PENDING",
  ] as const;
  for (let i = 0; i < 5; i++) {
    const ci = campaignInfluencers[i];
    await prisma.payment.create({
      data: {
        campaignInfluencerId: ci.id,
        influencerId: ci.influencerId,
        amount: ci.agreedFee || rand(200000, 500000),
        status: paymentStatuses[i],
        processedAt:
          paymentStatuses[i] === "COMPLETED" ? new Date() : undefined,
        note:
          paymentStatuses[i] === "COMPLETED"
            ? "정산 완료"
            : undefined,
      },
    });
  }
  console.log("✅ Created 5 payments");

  // ============================================
  // Portfolio Items (Gallery, 50 items)
  // ============================================
  const portfolioCaptions = [
    "이번 콜라보 정말 만족스러웠어요! 제품 퀄리티가 대박 💕",
    "브랜드와 함께한 특별한 캠페인 콘텐츠 📸",
    "요즘 가장 핫한 아이템 리뷰! 솔직 후기 드려요 ✨",
    "일상에서 자연스럽게 담아본 브이로그 스타일 🎬",
    "팔로워분들이 가장 좋아했던 콘텐츠! 반응 폭발 🔥",
    "새로운 시도! 이번 촬영 컨셉이 너무 좋았어요 📷",
    "여러분의 성원 덕분에 좋은 기회를 받았어요 감사합니다 🙏",
    "이거 진짜 써보면 다시 못 돌아감... 강추! 💯",
  ];
  const portfolioBrands = [
    "글로우업 코스메틱", "스타일런 패션", "딜리셔스 푸드",
    "테크노바", "피트라이프", "네이처블리스", "모던에센스",
    null, null, null,
  ];
  const portfolioCampaigns = [
    "#글로우업봄신상", "#스타일런룩북", "#딜리셔스맛집",
    "#테크노바리뷰", "#피트라이프챌린지", "#네이처블리스데일리",
    null, null, null, null,
  ];
  const portfolioMediaTypes = ["IMAGE", "IMAGE", "IMAGE", "IMAGE", "VIDEO", "VIDEO", "REEL", "REEL", "REEL", "CAROUSEL_ALBUM"] as const;

  const categoryDistribution = [
    ...Array(15).fill("뷰티"),
    ...Array(12).fill("패션"),
    ...Array(10).fill("푸드"),
    ...Array(8).fill("라이프스타일"),
    ...Array(5).fill("테크"),
  ];

  let portfolioCount = 0;
  for (let i = 0; i < 50; i++) {
    const infIndex = i % 20; // spread across first 20 influencers
    const inf = influencers[infIndex];
    const mediaType = portfolioMediaTypes[i % portfolioMediaTypes.length];
    const isReel = mediaType === "REEL" || mediaType === "VIDEO";
    const postedAt = new Date(now);
    postedAt.setDate(postedAt.getDate() - rand(1, 90));

    const likeCount = Math.floor(inf.followersCount * randFloat(0.02, 0.12));
    const commentsCount = Math.floor(likeCount * randFloat(0.02, 0.1));
    const reachVal = Math.floor(inf.followersCount * randFloat(0.3, 1.0));

    await prisma.portfolioItem.create({
      data: {
        influencerId: inf.id,
        igMediaId: `portfolio_${inf.username}_${i}`,
        mediaType,
        mediaUrl: isReel
          ? `https://picsum.photos/seed/port${i}/400/710`
          : `https://picsum.photos/seed/port${i}/400/400`,
        thumbnailUrl: `https://picsum.photos/seed/port${i}/400/${isReel ? 710 : 400}`,
        caption: portfolioCaptions[i % portfolioCaptions.length],
        likeCount,
        commentsCount,
        reach: reachVal,
        impressions: Math.floor(reachVal * randFloat(1.3, 2.0)),
        engagementRate: randFloat(1.5, 8.0),
        campaignName: portfolioCampaigns[i % portfolioCampaigns.length],
        brandName: portfolioBrands[i % portfolioBrands.length],
        category: categoryDistribution[i % categoryDistribution.length],
        isFeatured: i < 30,
        postedAt,
      },
    });
    portfolioCount++;
  }
  console.log(`✅ Created ${portfolioCount} portfolio items (Gallery)`);

  // ============================================
  // Update Influencers with extended fields
  // ============================================
  const locations = [
    "서울",
    "부산",
    "인천",
    "대구",
    "대전",
    "광주",
    "서울",
    "서울",
    "부산",
    "서울",
  ];
  const genders = [
    "female",
    "female",
    "male",
    "female",
    "male",
    "male",
    "female",
    "male",
    "female",
    "female",
  ];

  for (let i = 0; i < 30; i++) {
    await prisma.influencer.update({
      where: { id: influencers[i].id },
      data: {
        location: locations[i % locations.length],
        gender: genders[i % genders.length],
        bestPostThumbnail: `https://picsum.photos/seed/best${influencers[i].username}/400/500`,
        isTopCreator: i < 8,
        isUgc: i % 4 === 0,
        avgRating:
          i < 20
            ? parseFloat((3.5 + Math.random() * 1.5).toFixed(1))
            : null,
        reviewCount: i < 20 ? Math.floor(Math.random() * 15) + 1 : 0,
      },
    });
  }
  console.log("✅ Updated 30 influencers with extended fields");

  // ============================================
  // Reviews (15 records)
  // ============================================
  const reviewComments = [
    "훌륭한 콘텐츠였어요",
    "재협업 원합니다",
    "소통이 원활했어요",
    "기대 이상이었어요",
    "프로페셔널해요",
  ];
  for (let i = 0; i < 15; i++) {
    await prisma.review.create({
      data: {
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        comment: reviewComments[i % reviewComments.length],
        campaignId: campaigns[i % campaigns.length].id,
        brandId: brands[i % brands.length].id,
        creatorId: influencers[i % 20].id,
      },
    });
  }
  console.log("✅ Created 15 reviews");

  // ============================================
  // AI Models (12 models)
  // ============================================
  const aiModels = [
    { name: "수아", nameEn: "Sua", gender: "female", ageGroup: "20s", styles: ["casual", "lifestyle", "beauty"], bodyType: "slim", ethnicity: "asian" },
    { name: "하은", nameEn: "Haeun", gender: "female", ageGroup: "20s", styles: ["sporty", "fitness"], bodyType: "regular", ethnicity: "asian" },
    { name: "지유", nameEn: "Jiyu", gender: "female", ageGroup: "20s", styles: ["luxury", "fashion"], bodyType: "slim", ethnicity: "asian" },
    { name: "서연", nameEn: "Seoyeon", gender: "female", ageGroup: "30s", styles: ["natural", "beauty"], bodyType: "regular", ethnicity: "asian" },
    { name: "미나", nameEn: "Mina", gender: "female", ageGroup: "20s", styles: ["street", "hip"], bodyType: "slim", ethnicity: "mixed" },
    { name: "예진", nameEn: "Yejin", gender: "female", ageGroup: "30s", styles: ["formal", "business"], bodyType: "regular", ethnicity: "asian" },
    { name: "지호", nameEn: "Jiho", gender: "male", ageGroup: "30s", styles: ["business", "formal"], bodyType: "regular", ethnicity: "asian" },
    { name: "민준", nameEn: "Minjun", gender: "male", ageGroup: "20s", styles: ["street", "casual"], bodyType: "slim", ethnicity: "asian" },
    { name: "현우", nameEn: "Hyunwoo", gender: "male", ageGroup: "20s", styles: ["sporty", "fitness"], bodyType: "regular", ethnicity: "asian" },
    { name: "태윤", nameEn: "Taeyun", gender: "male", ageGroup: "30s", styles: ["luxury", "fashion"], bodyType: "slim", ethnicity: "asian" },
    { name: "준서", nameEn: "Junseo", gender: "male", ageGroup: "20s", styles: ["natural", "casual"], bodyType: "regular", ethnicity: "asian" },
    { name: "도윤", nameEn: "Doyun", gender: "male", ageGroup: "30s", styles: ["outdoor", "lifestyle"], bodyType: "regular", ethnicity: "asian" },
  ];

  const createdAiModels = [];
  for (let i = 0; i < aiModels.length; i++) {
    const m = aiModels[i];
    const model = await prisma.aIModel.create({
      data: {
        ...m,
        profileImage: `https://picsum.photos/seed/ai-${m.nameEn}/400/500`,
        portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-${m.nameEn}-${j}/400/500`),
        description: `${m.name} (${m.nameEn})는 ${m.ageGroup} ${m.gender === "female" ? "여성" : "남성"} AI 모델입니다.`,
        supportImage: true,
        supportVideo: i < 4,
        sortOrder: i,
      },
    });
    createdAiModels.push(model);
  }
  console.log(`✅ Created ${createdAiModels.length} AI models`);

  // ============================================
  // Sample AIGeneration records (Gallery AI tab)
  // ============================================
  const contentTypes = ["fashion", "beauty", "lifestyle", "fitness"];
  const sampleSettings = [
    { background: "studio", lighting: "soft" },
    { background: "outdoor", lighting: "natural" },
    { background: "urban", lighting: "golden_hour" },
    { background: "minimal", lighting: "dramatic" },
  ];

  // Use a placeholder system userId for samples (no real user needed)
  const SAMPLE_USER_ID = "sample-gallery-user";

  for (let i = 0; i < 8; i++) {
    const modelIndex = i % createdAiModels.length;
    const model = createdAiModels[modelIndex];
    await prisma.aIGeneration.create({
      data: {
        userId: SAMPLE_USER_ID,
        modelId: model.id,
        contentType: contentTypes[i % contentTypes.length],
        settings: sampleSettings[i % sampleSettings.length],
        resultImages: Array.from(
          { length: 4 },
          (_, j) => `https://picsum.photos/seed/sample-${model.nameEn}-${i}-${j}/400/500`
        ),
        creditsUsed: 0,
        status: "completed",
        isSample: true,
      },
    });
  }
  console.log("✅ Created 8 sample AIGeneration records (Gallery AI tab)");

  // ============================================
  // Test accounts summary
  // ============================================
  console.log("\n📋 Test Accounts:");
  console.log("Brand: brand1@test.com / password123");
  console.log("Brand: brand2@test.com / password123");
  console.log("Creator: creator1@test.com / password123");
  console.log("Creator: creator2@test.com / password123");
  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
