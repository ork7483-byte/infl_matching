"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// ── Types ──────────────────────────────────────────────────────────────────

type Category = "뷰티" | "패션" | "푸드" | "라이프스타일" | "여행" | "테크" | "피트니스";

interface MarketData {
  totalInfluencers: number;
  avgFollowers: number;
  avgEngagementRate: number;
  avgAQS: number;
  tierDistribution: { name: string; value: number; color: string }[];
  engagementTrend: { month: string; rate: number }[];
  priceTrend: { month: string; nano: number; micro: number; mid: number }[];
  topHashtags: string[];
  topInfluencers: {
    rank: number;
    username: string;
    name: string;
    followers: number;
    engagementRate: number;
    aqs: number;
    avgPrice: number;
  }[];
}

const TIER_COLORS = ["#a855f7", "#7c3aed", "#4f46e5", "#0ea5e9", "#10b981"];

// ── Mock Data by Category ──────────────────────────────────────────────────

const MOCK_DATA: Record<Category, MarketData> = {
  뷰티: {
    totalInfluencers: 18420,
    avgFollowers: 84300,
    avgEngagementRate: 4.8,
    avgAQS: 78,
    tierDistribution: [
      { name: "나노 (1K-10K)", value: 42, color: TIER_COLORS[0] },
      { name: "마이크로 (10K-100K)", value: 35, color: TIER_COLORS[1] },
      { name: "미드 (100K-500K)", value: 13, color: TIER_COLORS[2] },
      { name: "매크로 (500K-1M)", value: 7, color: TIER_COLORS[3] },
      { name: "메가 (1M+)", value: 3, color: TIER_COLORS[4] },
    ],
    engagementTrend: [
      { month: "10월", rate: 4.2 }, { month: "11월", rate: 4.5 }, { month: "12월", rate: 5.1 },
      { month: "1월", rate: 4.8 }, { month: "2월", rate: 5.3 }, { month: "3월", rate: 4.8 },
    ],
    priceTrend: [
      { month: "10월", nano: 45, micro: 180, mid: 620 },
      { month: "11월", nano: 48, micro: 195, mid: 640 },
      { month: "12월", nano: 55, micro: 220, mid: 710 },
      { month: "1월", nano: 50, micro: 205, mid: 680 },
      { month: "2월", nano: 52, micro: 215, mid: 695 },
      { month: "3월", nano: 54, micro: 218, mid: 720 },
    ],
    topHashtags: ["#스킨케어", "#뷰티루틴", "#데일리메이크업", "#글로우스킨", "#뷰티팁", "#스킨케어루틴", "#화장품추천", "#올리브영", "#비건뷰티", "#더마코스메틱", "#선크림추천", "#아이크림", "#수분크림", "#토너패드", "#각질제거", "#쿠션파운데이션", "#컨투어링", "#비비크림", "#미백크림", "#에센스"],
    topInfluencers: [
      { rank: 1, username: "@glowskin_official", name: "김민서", followers: 890000, engagementRate: 6.2, aqs: 92, avgPrice: 1800 },
      { rank: 2, username: "@beauty_hyun", name: "이현지", followers: 520000, engagementRate: 5.8, aqs: 88, avgPrice: 1200 },
      { rank: 3, username: "@dailybeauty_j", name: "박지은", followers: 340000, engagementRate: 7.1, aqs: 90, avgPrice: 850 },
      { rank: 4, username: "@skinsecret_y", name: "윤소연", followers: 290000, engagementRate: 5.3, aqs: 85, avgPrice: 720 },
      { rank: 5, username: "@glow_routine", name: "최서진", followers: 215000, engagementRate: 6.5, aqs: 87, avgPrice: 580 },
      { rank: 6, username: "@skin_diary_k", name: "강예림", followers: 178000, engagementRate: 4.9, aqs: 82, avgPrice: 450 },
      { rank: 7, username: "@beauty_note_s", name: "송하은", followers: 145000, engagementRate: 5.7, aqs: 84, avgPrice: 380 },
      { rank: 8, username: "@roseskin_m", name: "문채원", followers: 128000, engagementRate: 6.8, aqs: 89, avgPrice: 340 },
      { rank: 9, username: "@skincare_nana", name: "나지현", followers: 98000, engagementRate: 5.1, aqs: 81, avgPrice: 280 },
      { rank: 10, username: "@pure_glow_h", name: "한수아", followers: 87000, engagementRate: 4.6, aqs: 79, avgPrice: 240 },
    ],
  },
  패션: {
    totalInfluencers: 14650,
    avgFollowers: 102000,
    avgEngagementRate: 3.9,
    avgAQS: 74,
    tierDistribution: [
      { name: "나노 (1K-10K)", value: 38, color: TIER_COLORS[0] },
      { name: "마이크로 (10K-100K)", value: 32, color: TIER_COLORS[1] },
      { name: "미드 (100K-500K)", value: 18, color: TIER_COLORS[2] },
      { name: "매크로 (500K-1M)", value: 8, color: TIER_COLORS[3] },
      { name: "메가 (1M+)", value: 4, color: TIER_COLORS[4] },
    ],
    engagementTrend: [
      { month: "10월", rate: 3.5 }, { month: "11월", rate: 3.8 }, { month: "12월", rate: 4.2 },
      { month: "1월", rate: 3.7 }, { month: "2월", rate: 4.0 }, { month: "3월", rate: 3.9 },
    ],
    priceTrend: [
      { month: "10월", nano: 38, micro: 160, mid: 580 },
      { month: "11월", nano: 42, micro: 175, mid: 610 },
      { month: "12월", nano: 50, micro: 200, mid: 680 },
      { month: "1월", nano: 44, micro: 182, mid: 625 },
      { month: "2월", nano: 46, micro: 190, mid: 645 },
      { month: "3월", nano: 48, micro: 195, mid: 660 },
    ],
    topHashtags: ["#오오티디", "#패션스타그램", "#데일리룩", "#코디추천", "#스트릿패션", "#옷스타그램", "#패션인스타", "#빈티지패션", "#미니멀룩", "#가을코디", "#캐주얼룩", "#트렌드", "#쇼핑추천", "#하울", "#아울렛", "#SPA브랜드", "#한국패션", "#봄코디", "#레이어드룩", "#원피스"],
    topInfluencers: [
      { rank: 1, username: "@fashion_elle_k", name: "김예은", followers: 1200000, engagementRate: 4.8, aqs: 89, avgPrice: 2500 },
      { rank: 2, username: "@style_hwa", name: "이화영", followers: 680000, engagementRate: 4.2, aqs: 85, avgPrice: 1500 },
      { rank: 3, username: "@ootd_daily_j", name: "정수빈", followers: 420000, engagementRate: 5.1, aqs: 87, avgPrice: 1000 },
      { rank: 4, username: "@minimalist_s", name: "송지원", followers: 310000, engagementRate: 3.8, aqs: 80, avgPrice: 800 },
      { rank: 5, username: "@vintage_look_y", name: "유나", followers: 255000, engagementRate: 4.5, aqs: 83, avgPrice: 650 },
      { rank: 6, username: "@trend_k", name: "권미래", followers: 198000, engagementRate: 3.6, aqs: 78, avgPrice: 500 },
      { rank: 7, username: "@daily_coord_p", name: "박소정", followers: 164000, engagementRate: 4.9, aqs: 86, avgPrice: 420 },
      { rank: 8, username: "@casual_look_h", name: "허지인", followers: 142000, engagementRate: 3.3, aqs: 75, avgPrice: 360 },
      { rank: 9, username: "@autumn_style_m", name: "민지", followers: 113000, engagementRate: 4.7, aqs: 84, avgPrice: 300 },
      { rank: 10, username: "@chic_daily_l", name: "이채희", followers: 92000, engagementRate: 3.9, aqs: 77, avgPrice: 250 },
    ],
  },
  푸드: {
    totalInfluencers: 12340,
    avgFollowers: 56800,
    avgEngagementRate: 5.6,
    avgAQS: 72,
    tierDistribution: [
      { name: "나노 (1K-10K)", value: 48, color: TIER_COLORS[0] },
      { name: "마이크로 (10K-100K)", value: 33, color: TIER_COLORS[1] },
      { name: "미드 (100K-500K)", value: 12, color: TIER_COLORS[2] },
      { name: "매크로 (500K-1M)", value: 5, color: TIER_COLORS[3] },
      { name: "메가 (1M+)", value: 2, color: TIER_COLORS[4] },
    ],
    engagementTrend: [
      { month: "10월", rate: 5.1 }, { month: "11월", rate: 5.4 }, { month: "12월", rate: 6.2 },
      { month: "1월", rate: 5.8 }, { month: "2월", rate: 5.9 }, { month: "3월", rate: 5.6 },
    ],
    priceTrend: [
      { month: "10월", nano: 35, micro: 140, mid: 480 },
      { month: "11월", nano: 38, micro: 155, mid: 510 },
      { month: "12월", nano: 45, micro: 175, mid: 560 },
      { month: "1월", nano: 40, micro: 162, mid: 530 },
      { month: "2월", nano: 42, micro: 168, mid: 545 },
      { month: "3월", nano: 44, micro: 172, mid: 555 },
    ],
    topHashtags: ["#먹스타그램", "#맛스타그램", "#음식스타그램", "#레스토랑추천", "#카페투어", "#홈쿡", "#맛집추천", "#서울맛집", "#베이킹", "#비건", "#디저트", "#브런치", "#파스타", "#스시", "#한식", "#치킨", "#커피스타그램", "#와인", "#라멘", "#버거"],
    topInfluencers: [
      { rank: 1, username: "@foodie_seoul_k", name: "김맛있", followers: 560000, engagementRate: 7.2, aqs: 88, avgPrice: 1200 },
      { rank: 2, username: "@eat_travel_j", name: "정미식", followers: 380000, engagementRate: 6.5, aqs: 84, avgPrice: 900 },
      { rank: 3, username: "@cafe_hopping_s", name: "서카페", followers: 290000, engagementRate: 5.8, aqs: 82, avgPrice: 720 },
      { rank: 4, username: "@homecook_n", name: "남요리", followers: 220000, engagementRate: 8.1, aqs: 90, avgPrice: 580 },
      { rank: 5, username: "@dessert_lover_h", name: "허단맛", followers: 185000, engagementRate: 6.9, aqs: 86, avgPrice: 480 },
      { rank: 6, username: "@restaurant_guide_y", name: "윤맛가이드", followers: 148000, engagementRate: 5.3, aqs: 79, avgPrice: 380 },
      { rank: 7, username: "@vegan_table_m", name: "문채식", followers: 125000, engagementRate: 7.4, aqs: 87, avgPrice: 320 },
      { rank: 8, username: "@baking_diary_p", name: "박빵일기", followers: 108000, engagementRate: 6.2, aqs: 83, avgPrice: 280 },
      { rank: 9, username: "@brunch_c", name: "최브런치", followers: 89000, engagementRate: 5.7, aqs: 80, avgPrice: 240 },
      { rank: 10, username: "@coffee_tour_l", name: "이커피어", followers: 74000, engagementRate: 6.0, aqs: 81, avgPrice: 200 },
    ],
  },
  라이프스타일: {
    totalInfluencers: 21800,
    avgFollowers: 73500,
    avgEngagementRate: 4.1,
    avgAQS: 75,
    tierDistribution: [
      { name: "나노 (1K-10K)", value: 45, color: TIER_COLORS[0] },
      { name: "마이크로 (10K-100K)", value: 34, color: TIER_COLORS[1] },
      { name: "미드 (100K-500K)", value: 13, color: TIER_COLORS[2] },
      { name: "매크로 (500K-1M)", value: 6, color: TIER_COLORS[3] },
      { name: "메가 (1M+)", value: 2, color: TIER_COLORS[4] },
    ],
    engagementTrend: [
      { month: "10월", rate: 3.7 }, { month: "11월", rate: 4.0 }, { month: "12월", rate: 4.5 },
      { month: "1월", rate: 4.2 }, { month: "2월", rate: 4.3 }, { month: "3월", rate: 4.1 },
    ],
    priceTrend: [
      { month: "10월", nano: 40, micro: 165, mid: 560 },
      { month: "11월", nano: 43, micro: 178, mid: 590 },
      { month: "12월", nano: 50, micro: 200, mid: 650 },
      { month: "1월", nano: 45, micro: 185, mid: 610 },
      { month: "2월", nano: 47, micro: 192, mid: 625 },
      { month: "3월", nano: 49, micro: 196, mid: 638 },
    ],
    topHashtags: ["#일상", "#데일리", "#라이프스타일", "#인테리어", "#홈데코", "#미니멀라이프", "#자기계발", "#독서", "#운동일상", "#플랜트", "#집스타그램", "#취미", "#여가", "#주말", "#힐링", "#명상", "#제로웨이스트", "#지속가능", "#영감", "#모닝루틴"],
    topInfluencers: [
      { rank: 1, username: "@minimal_life_k", name: "김미니", followers: 720000, engagementRate: 5.2, aqs: 87, avgPrice: 1500 },
      { rank: 2, username: "@daily_joy_s", name: "서일상", followers: 490000, engagementRate: 4.6, aqs: 83, avgPrice: 1100 },
      { rank: 3, username: "@home_deco_j", name: "정홈데코", followers: 355000, engagementRate: 4.9, aqs: 85, avgPrice: 880 },
      { rank: 4, username: "@wellness_y", name: "윤웰니스", followers: 268000, engagementRate: 5.5, aqs: 88, avgPrice: 680 },
      { rank: 5, username: "@plant_room_c", name: "최플랜트", followers: 198000, engagementRate: 4.3, aqs: 81, avgPrice: 500 },
      { rank: 6, username: "@morning_h", name: "한모닝", followers: 162000, engagementRate: 5.1, aqs: 84, avgPrice: 420 },
      { rank: 7, username: "@self_grow_l", name: "이성장", followers: 138000, engagementRate: 3.8, aqs: 78, avgPrice: 360 },
      { rank: 8, username: "@calm_life_b", name: "배고요", followers: 115000, engagementRate: 4.7, aqs: 82, avgPrice: 300 },
      { rank: 9, username: "@cozy_n", name: "남포근", followers: 95000, engagementRate: 4.2, aqs: 79, avgPrice: 260 },
      { rank: 10, username: "@simple_joy_o", name: "오단순", followers: 78000, engagementRate: 3.9, aqs: 76, avgPrice: 220 },
    ],
  },
  여행: {
    totalInfluencers: 9820,
    avgFollowers: 128000,
    avgEngagementRate: 4.4,
    avgAQS: 76,
    tierDistribution: [
      { name: "나노 (1K-10K)", value: 35, color: TIER_COLORS[0] },
      { name: "마이크로 (10K-100K)", value: 30, color: TIER_COLORS[1] },
      { name: "미드 (100K-500K)", value: 20, color: TIER_COLORS[2] },
      { name: "매크로 (500K-1M)", value: 10, color: TIER_COLORS[3] },
      { name: "메가 (1M+)", value: 5, color: TIER_COLORS[4] },
    ],
    engagementTrend: [
      { month: "10월", rate: 4.0 }, { month: "11월", rate: 4.2 }, { month: "12월", rate: 4.8 },
      { month: "1월", rate: 4.5 }, { month: "2월", rate: 4.6 }, { month: "3월", rate: 4.4 },
    ],
    priceTrend: [
      { month: "10월", nano: 50, micro: 200, mid: 700 },
      { month: "11월", nano: 53, micro: 215, mid: 730 },
      { month: "12월", nano: 62, micro: 250, mid: 820 },
      { month: "1월", nano: 55, micro: 225, mid: 760 },
      { month: "2월", nano: 58, micro: 235, mid: 780 },
      { month: "3월", nano: 60, micro: 240, mid: 795 },
    ],
    topHashtags: ["#여행스타그램", "#해외여행", "#국내여행", "#여행일기", "#여행사진", "#여행에미치다", "#제주도", "#발리", "#도쿄", "#파리", "#뉴욕", "#방콕", "#싱가포르", "#호텔스타그램", "#항공권", "#배낭여행", "#허니문", "#혼여", "#캠핑", "#글램핑"],
    topInfluencers: [
      { rank: 1, username: "@travel_k_world", name: "김세계", followers: 1500000, engagementRate: 5.8, aqs: 91, avgPrice: 3200 },
      { rank: 2, username: "@wanderlust_j", name: "정방랑", followers: 820000, engagementRate: 5.1, aqs: 87, avgPrice: 1800 },
      { rank: 3, username: "@trip_diary_s", name: "서여행", followers: 540000, engagementRate: 4.7, aqs: 85, avgPrice: 1200 },
      { rank: 4, username: "@globe_h", name: "한글로벌", followers: 380000, engagementRate: 5.3, aqs: 88, avgPrice: 950 },
      { rank: 5, username: "@solo_travel_y", name: "윤솔로", followers: 285000, engagementRate: 6.2, aqs: 90, avgPrice: 720 },
      { rank: 6, username: "@cafe_world_c", name: "최카페", followers: 220000, engagementRate: 4.5, aqs: 82, avgPrice: 560 },
      { rank: 7, username: "@jeju_lover_m", name: "문제주", followers: 178000, engagementRate: 5.9, aqs: 89, avgPrice: 450 },
      { rank: 8, username: "@hotel_review_p", name: "박호텔", followers: 145000, engagementRate: 4.1, aqs: 79, avgPrice: 380 },
      { rank: 9, username: "@budget_travel_l", name: "이저비", followers: 118000, engagementRate: 5.4, aqs: 84, avgPrice: 300 },
      { rank: 10, username: "@asia_trip_n", name: "남아시아", followers: 94000, engagementRate: 4.8, aqs: 81, avgPrice: 250 },
    ],
  },
  테크: {
    totalInfluencers: 6540,
    avgFollowers: 95400,
    avgEngagementRate: 3.2,
    avgAQS: 71,
    tierDistribution: [
      { name: "나노 (1K-10K)", value: 30, color: TIER_COLORS[0] },
      { name: "마이크로 (10K-100K)", value: 38, color: TIER_COLORS[1] },
      { name: "미드 (100K-500K)", value: 20, color: TIER_COLORS[2] },
      { name: "매크로 (500K-1M)", value: 9, color: TIER_COLORS[3] },
      { name: "메가 (1M+)", value: 3, color: TIER_COLORS[4] },
    ],
    engagementTrend: [
      { month: "10월", rate: 2.9 }, { month: "11월", rate: 3.1 }, { month: "12월", rate: 3.5 },
      { month: "1월", rate: 3.3 }, { month: "2월", rate: 3.4 }, { month: "3월", rate: 3.2 },
    ],
    priceTrend: [
      { month: "10월", nano: 55, micro: 220, mid: 780 },
      { month: "11월", nano: 58, micro: 235, mid: 810 },
      { month: "12월", nano: 65, micro: 260, mid: 890 },
      { month: "1월", nano: 60, micro: 245, mid: 840 },
      { month: "2월", nano: 62, micro: 252, mid: 860 },
      { month: "3월", nano: 63, micro: 256, mid: 870 },
    ],
    topHashtags: ["#테크리뷰", "#IT기기", "#스마트폰", "#노트북추천", "#유튜버", "#개발자", "#AI", "#앱추천", "#게임", "#이어폰추천", "#카메라", "#드론", "#스마트홈", "#웨어러블", "#태블릿", "#기계식키보드", "#모니터", "#코딩", "#스타트업", "#IT뉴스"],
    topInfluencers: [
      { rank: 1, username: "@tech_review_k", name: "김테크", followers: 980000, engagementRate: 4.5, aqs: 86, avgPrice: 2200 },
      { rank: 2, username: "@gadget_j", name: "정가젯", followers: 620000, engagementRate: 3.8, aqs: 82, avgPrice: 1400 },
      { rank: 3, username: "@it_daily_s", name: "서아이티", followers: 450000, engagementRate: 3.2, aqs: 78, avgPrice: 1000 },
      { rank: 4, username: "@dev_h", name: "한개발", followers: 320000, engagementRate: 5.1, aqs: 88, avgPrice: 800 },
      { rank: 5, username: "@phone_master_y", name: "윤폰마스터", followers: 245000, engagementRate: 3.7, aqs: 80, avgPrice: 620 },
      { rank: 6, username: "@ai_talk_c", name: "최AI", followers: 190000, engagementRate: 4.3, aqs: 83, avgPrice: 480 },
      { rank: 7, username: "@gamer_m", name: "문게이머", followers: 165000, engagementRate: 2.9, aqs: 74, avgPrice: 420 },
      { rank: 8, username: "@smart_home_p", name: "박스마트홈", followers: 138000, engagementRate: 3.5, aqs: 79, avgPrice: 350 },
      { rank: 9, username: "@startup_l", name: "이스타트업", followers: 108000, engagementRate: 4.8, aqs: 85, avgPrice: 280 },
      { rank: 10, username: "@code_n", name: "남코딩", followers: 88000, engagementRate: 3.1, aqs: 76, avgPrice: 230 },
    ],
  },
  피트니스: {
    totalInfluencers: 11200,
    avgFollowers: 68900,
    avgEngagementRate: 5.9,
    avgAQS: 80,
    tierDistribution: [
      { name: "나노 (1K-10K)", value: 40, color: TIER_COLORS[0] },
      { name: "마이크로 (10K-100K)", value: 36, color: TIER_COLORS[1] },
      { name: "미드 (100K-500K)", value: 15, color: TIER_COLORS[2] },
      { name: "매크로 (500K-1M)", value: 7, color: TIER_COLORS[3] },
      { name: "메가 (1M+)", value: 2, color: TIER_COLORS[4] },
    ],
    engagementTrend: [
      { month: "10월", rate: 5.4 }, { month: "11월", rate: 5.7 }, { month: "12월", rate: 6.3 },
      { month: "1월", rate: 6.8 }, { month: "2월", rate: 6.1 }, { month: "3월", rate: 5.9 },
    ],
    priceTrend: [
      { month: "10월", nano: 42, micro: 168, mid: 580 },
      { month: "11월", nano: 45, micro: 180, mid: 610 },
      { month: "12월", nano: 52, micro: 208, mid: 680 },
      { month: "1월", nano: 55, micro: 220, mid: 720 },
      { month: "2월", nano: 50, micro: 205, mid: 695 },
      { month: "3월", nano: 51, micro: 210, mid: 705 },
    ],
    topHashtags: ["#운동스타그램", "#헬스", "#다이어트", "#피트니스", "#요가", "#필라테스", "#홈트", "#런닝", "#헬창", "#바디프로필", "#식단관리", "#단백질", "#크로스핏", "#웨이트트레이닝", "#스트레칭", "#근육", "#몸스타그램", "#핫요가", "#PT추천", "#건강"],
    topInfluencers: [
      { rank: 1, username: "@fit_body_k", name: "김핏바디", followers: 780000, engagementRate: 7.5, aqs: 93, avgPrice: 1700 },
      { rank: 2, username: "@yoga_j", name: "정요가", followers: 520000, engagementRate: 6.8, aqs: 90, avgPrice: 1200 },
      { rank: 3, username: "@pilates_s", name: "서필라테스", followers: 380000, engagementRate: 7.2, aqs: 91, avgPrice: 950 },
      { rank: 4, username: "@run_every_h", name: "한매일런", followers: 270000, engagementRate: 6.3, aqs: 88, avgPrice: 680 },
      { rank: 5, username: "@diet_diary_y", name: "윤다이어트", followers: 195000, engagementRate: 5.8, aqs: 85, avgPrice: 490 },
      { rank: 6, username: "@home_workout_c", name: "최홈트", followers: 162000, engagementRate: 7.9, aqs: 92, avgPrice: 410 },
      { rank: 7, username: "@protein_m", name: "문단백", followers: 138000, engagementRate: 5.5, aqs: 83, avgPrice: 350 },
      { rank: 8, username: "@crossfit_p", name: "박크로스핏", followers: 115000, engagementRate: 6.6, aqs: 87, avgPrice: 290 },
      { rank: 9, username: "@stretch_l", name: "이스트레치", followers: 96000, engagementRate: 5.1, aqs: 81, avgPrice: 250 },
      { rank: 10, username: "@body_profile_n", name: "남바프", followers: 82000, engagementRate: 7.3, aqs: 90, avgPrice: 210 },
    ],
  },
};

const CATEGORIES: Category[] = ["뷰티", "패션", "푸드", "라이프스타일", "여행", "테크", "피트니스"];

// ── Helpers ────────────────────────────────────────────────────────────────

function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-1" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
      <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">{label}</span>
      <span className="text-2xl font-bold" style={{ color: color ?? "#111827" }}>{value}</span>
      {sub && <span className="text-xs text-[#9CA3AF]">{sub}</span>}
    </div>
  );
}



// ── Main Page ──────────────────────────────────────────────────────────────

export default function MarketAnalysisPage() {
  const [category, setCategory] = useState<Category>("뷰티");
  const data = MOCK_DATA[category];

  function handleDownload() {
    alert(`[Demo] ${category} 카테고리 PDF 리포트 다운로드 중...`);
  }

  return (
    <DashboardLayout role="brand">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">시장 분석 리포트</h1>
            <p className="text-[#6B7280] mt-1 text-sm">카테고리별 인플루언서 시장 현황을 분석하세요.</p>
          </div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer self-start sm:self-auto"
            style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #a855f7)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            PDF 리포트 다운로드
          </button>
        </div>

        {/* Category Select */}
        <div className="rounded-xl p-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
          <label className="block text-sm font-medium text-[#374151] mb-3">카테고리 선택</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                style={
                  category === cat
                    ? { backgroundColor: "#7c3aed", color: "#FFFFFF" }
                    : { backgroundColor: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="등록 인플루언서 수"
            value={data.totalInfluencers.toLocaleString()}
            sub="명"
            color="#7c3aed"
          />
          <StatCard
            label="평균 팔로워"
            value={formatFollowers(data.avgFollowers)}
            sub="팔로워"
          />
          <StatCard
            label="평균 참여율"
            value={`${data.avgEngagementRate}%`}
            sub="인게이지먼트"
            color="#e94560"
          />
          <StatCard
            label="평균 AQS"
            value={String(data.avgAQS)}
            sub="오디언스 품질 점수"
            color="#10b981"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donut Chart */}
          <div className="rounded-xl p-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
            <h2 className="text-sm font-semibold text-[#111827] mb-4">팔로워 규모별 분포</h2>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={data.tierDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.tierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, ""]}
                    contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-1.5 mt-2">
                {data.tierDistribution.map((tier) => (
                  <div key={tier.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: tier.color }} />
                      <span className="text-[#6B7280]">{tier.name}</span>
                    </div>
                    <span className="font-semibold text-[#111827]">{tier.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Engagement Trend */}
          <div className="rounded-xl p-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
            <h2 className="text-sm font-semibold text-[#111827] mb-4">월간 참여율 추이</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.engagementTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} domain={["auto", "auto"]} />
                <Tooltip
                  formatter={(v) => [`${v}%`, "참여율"]}
                  contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "12px" }}
                />
                <Line type="monotone" dataKey="rate" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Price Trend */}
          <div className="rounded-xl p-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
            <h2 className="text-sm font-semibold text-[#111827] mb-4">평균 단가 변화 (만원)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.priceTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <Tooltip
                  formatter={(v, name) => [`₩${v}만`, name]}
                  contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="nano" name="나노" stroke="#a855f7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="micro" name="마이크로" stroke="#7c3aed" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="mid" name="미드" stroke="#4f46e5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Hashtags */}
        <div className="rounded-xl p-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
          <h2 className="text-sm font-semibold text-[#111827] mb-4">인기 해시태그 TOP 20</h2>
          <div className="flex flex-wrap gap-2">
            {data.topHashtags.map((tag, i) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: i < 5 ? "#F5F3FF" : "#F9FAFB",
                  color: i < 5 ? "#7c3aed" : "#374151",
                  border: `1px solid ${i < 5 ? "#DDD6FE" : "#E5E7EB"}`,
                }}
              >
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{
                    backgroundColor: i < 5 ? "#7c3aed" : "#E5E7EB",
                    color: i < 5 ? "#FFFFFF" : "#6B7280",
                  }}
                >
                  {i + 1}
                </span>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* TOP 10 Influencers Table */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
            <h2 className="text-sm font-semibold text-[#111827]">TOP 10 인플루언서 — {category}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-12">순위</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">인플루언서</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">팔로워</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">참여율</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">AQS</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">평균 단가</th>
                </tr>
              </thead>
              <tbody>
                {data.topInfluencers.map((inf) => (
                  <tr key={inf.rank} className="border-t" style={{ borderColor: "#E5E7EB" }}>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                        style={
                          inf.rank <= 3
                            ? { backgroundColor: "#F5F3FF", color: "#7c3aed" }
                            : { color: "#9CA3AF" }
                        }
                      >
                        {inf.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[#7c3aed] text-sm">{inf.username}</p>
                        <p className="text-xs text-[#9CA3AF]">{inf.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[#111827]">{formatFollowers(inf.followers)}</td>
                    <td className="px-4 py-3 text-right text-[#111827] hidden sm:table-cell">{inf.engagementRate}%</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span
                        className="font-semibold"
                        style={{ color: inf.aqs >= 85 ? "#059669" : inf.aqs >= 75 ? "#7c3aed" : "#6B7280" }}
                      >
                        {inf.aqs}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#111827] hidden lg:table-cell">₩{inf.avgPrice}만</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
