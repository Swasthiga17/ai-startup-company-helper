import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Sparkles, Lightbulb, Compass, Users, Grid, BookOpen,
  DollarSign, Award, Presentation, Shield, ArrowRight, ArrowLeft,
  Check, Cpu, Star, Flame, ChevronRight, Activity, Zap, CheckCircle2, MessageSquare, Bot,
  Layers, PieChart, TrendingUp, HelpCircle, Filter, RefreshCw
} from 'lucide-react';
import VoicePlayerBar from '../components/VoicePlayerBar';

// Complete problem-solution templates for category cards
const categoryDataset = {
  'ai-automation': {
    id: 'ai-automation',
    title: 'AI & Automation Services',
    subtitle: 'Build AI-powered businesses that automate workflows, improve productivity, and reduce operational costs.',
    gradient: 'from-[#6D28FF] via-purple-600 to-[#EC4899]',
    badge: '🔥 High Demand',
    market: { tam: '$48 Billion', growth: '28% CAGR', competition: 'Medium', funding: 'High VC Interest' },
    popularFeatures: ['AI Chat Agents', 'GPT-4 / Gemini RAG', 'Workflow Automation', 'Real-time Analytics', 'CRM Auto-Sync'],
    ideas: [
      {
        id: 'ai-customer-support',
        title: 'AI Customer Support Platform',
        rating: '4.9 ★★★★★',
        tag: 'SaaS',
        subTag: 'SupportTech',
        problem: 'E-commerce and SaaS companies struggle with 24/7 customer support costs, slow queue times, and agent burnout.',
        solution: 'Autonomous multi-agent customer support platform that integrates with Shopify & Zendesk to instantly resolve 85% of support tickets with human-like accuracy.',
        targetCustomers: ['E-Commerce Brands', 'B2B SaaS Companies', 'Digital Agencies'],
        revenueModel: ['Monthly Tiered Subscription ($49 - $499/mo)', 'Pay-per-Ticket ($0.10/ticket)'],
        competitors: ['Intercom Fin', 'Zendesk AI', 'Ada.cx'],
        marketSizing: { tam: '$18B Global SupportTech', sam: '$4.2B Mid-Market', som: '$25M Target Yr 2' },
        roadmap: ['Phase 1: Shopify & Zendesk Integration MVP', 'Phase 2: RAG Multi-Agent Ticket Auto-Resolver', 'Phase 3: Omnichannel Voice & WhatsApp AI'],
        fullIdeaText: 'Startup Name: SupportMind AI. Industry: Artificial Intelligence. Country: United States. Stage: Idea Stage. Problem: E-commerce and SaaS companies struggle with high 24/7 customer support costs and long queue times.. Solution: Autonomous multi-agent customer support platform that integrates with Shopify & Zendesk to instantly resolve 85% of support tickets with human-like accuracy.. Target Users: Online merchants & B2B SaaS teams.'
      },
      {
        id: 'ai-resume-builder',
        title: 'AI Resume Builder & ATS Optimizer',
        rating: '4.8 ★★★★★',
        tag: 'SaaS',
        subTag: 'HRTech',
        problem: 'Job seekers spend hours tailoring resumes for Applicant Tracking Systems (ATS) without knowing how recruiters rank candidates.',
        solution: 'Use AI to scan job descriptions, rank candidate suitability, extract key skills, and auto-generate ATS-proof resumes and cover letters in 30 seconds.',
        targetCustomers: ['College Undergrads', 'Job Seekers', 'Career Switchers'],
        revenueModel: ['Freemium (3 Free Scans)', 'Pro Monthly Pass ($19/mo)'],
        competitors: ['LinkedIn Resume Assistant', 'Jobscan', 'Rezi.ai'],
        marketSizing: { tam: '$9.5B HRTech & Career Prep', sam: '$2.1B Student Market', som: '$15M Target Yr 2' },
        roadmap: ['Phase 1: ATS Resume Score & Keyword Extractor', 'Phase 2: One-Click AI Resume Generator', 'Phase 3: Automated LinkedIn Sync'],
        fullIdeaText: 'Startup Name: ResumeGenie AI. Industry: Artificial Intelligence. Country: United States. Stage: Idea Stage. Problem: Job seekers spend hours tailoring resumes for ATS scanners without knowing what recruiters look for.. Solution: Real-time AI resume optimizer that scans job descriptions, tailors keywords, and generates ATS-optimized resumes in 30 seconds.. Target Users: Job seekers & university graduates.'
      }
    ]
  },
  'healthtech': {
    id: 'healthtech',
    title: 'HealthTech Platforms',
    subtitle: 'Transform healthcare with AI telemedicine triage, mental health companions, and predictive hospital operations.',
    gradient: 'from-emerald-600 via-teal-600 to-[#0EA5E9]',
    badge: '🏥 $188B Industry',
    market: { tam: '$188 Billion', growth: '25% CAGR', competition: 'Moderate', funding: 'Grants & VC' },
    popularFeatures: ['Google Fit / Apple Health Sync', 'FHIR Data Protocol', 'AI Triage Engine', 'HIPAA Vault'],
    ideas: [
      {
        id: 'ai-telemedicine',
        title: 'AI Telemedicine Triage Platform',
        rating: '4.9 ★★★★★',
        tag: 'Telehealth',
        subTag: 'CareDelivery',
        problem: 'Patients face 3-week wait times for primary care appointments, while emergency rooms are overwhelmed with non-urgent cases.',
        solution: 'AI-powered triage app that analyzes patient symptoms, orders pre-consultation lab panels, and routes urgent cases directly to licensed doctors.',
        targetCustomers: ['Rural Patients', 'Elderly Care Facilities', 'Self-Insured Employers'],
        revenueModel: ['Per-Consultation Fee ($35/visit)', 'Employer Subscription ($8/employee/mo)'],
        competitors: ['Teladoc', 'Babylon Health', 'K Health'],
        marketSizing: { tam: '$90B Global Telemedicine', sam: '$22B US Triage', som: '$40M Target Yr 2' },
        roadmap: ['Phase 1: Symptom Checker & Intake Form', 'Phase 2: Live Doctor Consultation Gateway', 'Phase 3: Predictive Risk Sync'],
        fullIdeaText: 'Startup Name: TeleHealth AI. Industry: Healthcare. Country: United States. Stage: Idea Stage. Problem: Patients face long wait times for primary care consultations and rural areas lack specialist access.. Solution: AI-powered telemedicine triage platform that connects patients with licensed doctors and provides preliminary symptom checking.. Target Users: Rural patients & busy professionals.'
      }
    ]
  },
  'b2b-saas': {
    id: 'b2b-saas',
    title: 'B2B SaaS Solutions',
    subtitle: 'Streamline enterprise operations with intelligent CRMs, automated payroll, inventory prediction, and recurring billing.',
    gradient: 'from-[#0EA5E9] via-indigo-600 to-[#8B5CF6]',
    badge: '☁️ High Margin',
    market: { tam: '$310 Billion', growth: '19.5% CAGR', competition: 'Medium', funding: 'Very High' },
    popularFeatures: ['Automated Invoicing', 'Role-Based Access (RBAC)', 'Stripe Payment Gateway', 'REST APIs'],
    ideas: [
      {
        id: 'crm-small-business',
        title: 'AI-Native CRM for Small Businesses',
        rating: '4.9 ★★★★★',
        tag: 'B2B SaaS',
        subTag: 'SalesTech',
        problem: 'Small business owners find legacy CRMs like Salesforce too complex, expensive, and time-consuming to manually enter deal data.',
        solution: 'Zero-data-entry AI CRM that auto-captures customer phone calls, drafts follow-up emails, updates pipeline stages, and highlights closing signals.',
        targetCustomers: ['Local Service Businesses', 'Real Estate Brokers', 'B2B Agencies'],
        revenueModel: ['Freemium (1 Sales Rep)', 'Pro Seat ($29/user/mo)'],
        competitors: ['HubSpot CRM', 'Salesforce Essentials', 'Zoho CRM'],
        marketSizing: { tam: '$65B Global CRM', sam: '$14B SMB Sales Tech', som: '$35M Target Yr 2' },
        roadmap: ['Phase 1: Email & Call Auto-Logging Integration', 'Phase 2: AI Deal Probability Predictor', 'Phase 3: WhatsApp Sales Sequences'],
        fullIdeaText: 'Startup Name: SimpleCRM AI. Industry: B2B SaaS. Country: United States. Stage: Idea Stage. Problem: Legacy CRMs like Salesforce are bloated, expensive, and require weeks of setup for small business owners.. Solution: AI-native lightweight CRM that automatically logs sales calls, drafts follow-up emails, and predicts deal closure likelihood.. Target Users: Small business owners & solo sales reps.'
      }
    ]
  },
  'cybersecurity': {
    id: 'cybersecurity',
    title: 'Data & Cybersecurity',
    subtitle: 'Protect modern infrastructure with AI threat detection, zero-trust identity verification, and continuous compliance monitoring.',
    gradient: 'from-slate-900 via-purple-950 to-indigo-950',
    badge: '🔒 Mission Critical',
    market: { tam: '$376 Billion', growth: '14.2% CAGR', competition: 'High Barrier', funding: 'Premium Valuations' },
    popularFeatures: ['SOC2 & HIPAA Evidence Collector', 'AI Behavioral Anomaly Engine', 'Zero-Trust IAM'],
    ideas: [
      {
        id: 'cloud-vulnerability-scanner',
        title: 'Autonomous Cloud Vulnerability Scanner',
        rating: '4.9 ★★★★★',
        tag: 'Cybersecurity',
        subTag: 'DevSecOps',
        problem: 'Cloud infrastructure misconfigurations on AWS/GCP leave 65% of startups exposed to data breaches and audit failures.',
        solution: 'Autonomous agent that continuously audits cloud security policies, remediates open ports automatically, and generates one-click SOC2 audit evidence.',
        targetCustomers: ['Cloud-Native Startups', 'DevOps & Security Teams', 'Fintech Platforms'],
        revenueModel: ['Developer Tier ($99/mo)', 'Growth Cloud ($499/mo)'],
        competitors: ['Wiz.io', 'Orca Security', 'Vanta'],
        marketSizing: { tam: '$45B Cloud Security', sam: '$9.8B DevSecOps Automation', som: '$28M Target Yr 2' },
        roadmap: ['Phase 1: AWS/GCP Security Audit Scanner', 'Phase 2: One-Click SOC2 & HIPAA Evidence Export', 'Phase 3: Auto-Remediation Bot'],
        fullIdeaText: 'Startup Name: CloudGuard AI. Industry: Cybersecurity. Country: United States. Stage: Idea Stage. Problem: Cloud infrastructure misconfigurations (AWS, GCP, Azure) leave enterprise data exposed to hackers.. Solution: Autonomous vulnerability scanner that continuously audits cloud security policies, SOC2 compliance, and open ports.. Target Users: DevOps engineers & CISOs.'
      }
    ]
  }
};

// 80 Master Startup Ideas Catalog (10 Ideas per Domain across 8 Domains)
const masterIdeasCatalog = [
  // 🤖 1. AI DOMAIN (10 Ideas)
  {
    title: 'AI Customer Support Agent',
    category: 'AI',
    type: 'SaaS',
    domains: ['AI'],
    score: '98% Match',
    marketPotential: 'Explosive ($18B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly SaaS ($49 - $499/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Businesses suffer high 24/7 customer support costs, long queue times, and agent burnout.',
    solution: 'Multilingual AI chatbot for businesses with automated ticket resolution and Zendesk/Shopify sync.',
    fullIdeaText: 'Startup Name: SupportMind AI. Industry: Artificial Intelligence. Problem: E-commerce & SaaS teams suffer high 24/7 support costs. Solution: Multilingual AI chatbot resolving 85% of support tickets automatically.'
  },
  {
    title: 'AI Meeting Summarizer & Action Item Tracker',
    category: 'AI',
    type: 'SaaS',
    domains: ['AI'],
    score: '96% Match',
    marketPotential: 'High ($8.5B)',
    difficulty: 'Beginner',
    revenueModel: 'Freemium + $19/user/mo',
    timeToMVP: '2 Weeks',
    problem: 'Remote teams waste hours taking manual meeting notes and lose track of assigned action items.',
    solution: 'AI bot that transcribes Zoom and Google Meet calls, summarizes key decisions, and auto-syncs tasks to Notion.',
    fullIdeaText: 'Startup Name: MeetPulse AI. Industry: Artificial Intelligence. Problem: Teams waste hours writing manual meeting notes. Solution: AI bot that transcribes Zoom calls and syncs tasks to Notion.'
  },
  {
    title: 'AI Resume Screening & Ranking Engine',
    category: 'AI',
    type: 'B2B',
    domains: ['AI'],
    score: '97% Match',
    marketPotential: 'High ($9.5B)',
    difficulty: 'Intermediate',
    revenueModel: 'Per-Job Posting or Enterprise SLA',
    timeToMVP: '3 Weeks',
    problem: 'Recruiters spend 20+ hours a week sifting through thousands of irrelevant applicant resumes.',
    solution: 'Automatically ranks applicant resumes based on skill match scores, job description fit, and verified experience.',
    fullIdeaText: 'Startup Name: RankResume AI. Industry: Artificial Intelligence. Problem: Recruiters waste time screening resumes manually. Solution: AI engine that ranks candidate resumes based on ATS job fit scores.'
  },
  {
    title: 'AI Multi-Channel Content Studio',
    category: 'AI',
    type: 'AI Product',
    domains: ['AI'],
    score: '95% Match',
    marketPotential: 'High ($20B)',
    difficulty: 'Beginner',
    revenueModel: 'Monthly Subscription ($29 - $199/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Creators and marketing teams struggle to maintain consistent content across blogs, social media, and newsletters.',
    solution: 'Generative AI content engine creating blogs, ad copy, and social posts aligned with brand voice in seconds.',
    fullIdeaText: 'Startup Name: OmniContent AI. Industry: Artificial Intelligence. Problem: Marketing teams struggle with multi-channel content output. Solution: All-in-one AI content studio creating blogs, ads, and posts.'
  },
  {
    title: 'AI Code Reviewer & Vulnerability Scanner',
    category: 'AI',
    type: 'SaaS',
    domains: ['AI'],
    score: '99% Match',
    marketPotential: 'Explosive ($12B)',
    difficulty: 'Advanced',
    revenueModel: 'Developer Seat ($15/dev/mo)',
    timeToMVP: '4 Weeks',
    problem: 'Software engineering teams push buggy or vulnerable code to production due to rushed manual code reviews.',
    solution: 'AI GitHub bot that reviews pull requests, highlights security vulnerabilities, and suggests optimized refactors.',
    fullIdeaText: 'Startup Name: CodeGuard AI. Industry: Artificial Intelligence. Problem: Engineering teams push vulnerable code due to rushed reviews. Solution: AI GitHub bot that audits PRs and suggests clean refactors.'
  },
  {
    title: 'Custom Enterprise AI Voice Assistant',
    category: 'AI',
    type: 'B2B',
    domains: ['AI'],
    score: '94% Match',
    marketPotential: 'High ($11B)',
    difficulty: 'Advanced',
    revenueModel: 'Custom Enterprise Licensing ($2k+/mo)',
    timeToMVP: '4 Weeks',
    problem: 'Field workers and warehouse staff cannot easily query internal ERP systems while keeping hands free.',
    solution: 'Custom enterprise voice assistant trained on internal documentation to answer operational queries hands-free.',
    fullIdeaText: 'Startup Name: VoiceEnterprise AI. Industry: Artificial Intelligence. Problem: Field workers cannot query internal ERP systems hands-free. Solution: Custom AI voice assistant trained on enterprise knowledge bases.'
  },
  {
    title: 'AI Legal Document & Contract Risk Analyzer',
    category: 'AI',
    type: 'B2B',
    domains: ['AI'],
    score: '96% Match',
    marketPotential: 'High ($14B)',
    difficulty: 'Intermediate',
    revenueModel: 'Per-Contract Scan ($10) or Monthly SLA',
    timeToMVP: '3 Weeks',
    problem: 'Founders and small businesses pay thousands to lawyers for routine commercial contract reviews.',
    solution: 'AI legal co-pilot that reviews NDAs, SaaS vendor agreements, and employment contracts using fine-tuned LLMs.',
    fullIdeaText: 'Startup Name: LegalMind AI. Industry: Artificial Intelligence. Problem: Small businesses spend thousands on routine legal contract reviews. Solution: AI legal assistant reviewing NDAs and commercial contracts.'
  },
  {
    title: 'AI Technical Interview Coach & Voice Simulator',
    category: 'AI',
    type: 'SaaS',
    domains: ['AI'],
    score: '97% Match',
    marketPotential: 'High ($7.5B)',
    difficulty: 'Intermediate',
    revenueModel: 'Pro Subscription ($19/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Computer science students freeze during live technical interviews due to non-interactive practice tools.',
    solution: 'Voice-enabled AI interviewer that conducts realistic coding challenges and evaluates verbal communication in real time.',
    fullIdeaText: 'Startup Name: InterviewPilot AI. Industry: Artificial Intelligence. Problem: CS students freeze during live technical interviews. Solution: Voice AI mock interviewer conducting 24/7 coding challenges.'
  },
  {
    title: 'AI Academic Research Assistant & Paper Summarizer',
    category: 'AI',
    type: 'AI Product',
    domains: ['AI'],
    score: '93% Match',
    marketPotential: 'Growing ($5B)',
    difficulty: 'Beginner',
    revenueModel: 'Freemium + $12/mo Student Plan',
    timeToMVP: '2 Weeks',
    problem: 'Researchers and PhD students spend weeks reading dense literature to find relevant methodology data.',
    solution: 'AI research assistant that synthesizes paper abstracts, extracts methodology tables, and generates BibTeX citations.',
    fullIdeaText: 'Startup Name: ScholarAI Assistant. Industry: Artificial Intelligence. Problem: Researchers spend weeks reading dense academic papers. Solution: AI assistant synthesizing research papers and generating literature summaries.'
  },
  {
    title: 'AI Startup Co-Founder & Business Plan Generator',
    category: 'AI',
    type: 'SaaS',
    domains: ['AI'],
    score: '99% Match',
    marketPotential: 'Explosive ($25B)',
    difficulty: 'Intermediate',
    revenueModel: 'Freemium + $29/mo Pro Founder',
    timeToMVP: '3 Weeks',
    problem: 'First-time founders lack affordable business guidance, market research tools, and investor pitch deck creation.',
    solution: 'Autonomous AI co-pilot that validates startup concepts, predicts 5-year revenue, and outputs investor pitch decks.',
    fullIdeaText: 'Startup Name: IdeaExecutor AI. Industry: Artificial Intelligence. Problem: Early-stage founders lack business guidance and market data. Solution: Autonomous AI co-founder generating BMC, SWOT, and pitch decks.'
  },

  // 🏥 2. HEALTHCARE DOMAIN (10 Ideas)
  {
    title: 'AI Telemedicine Triage & Doctor Consultation Platform',
    category: 'Healthcare',
    type: 'Mobile App',
    domains: ['Healthcare', 'AI'],
    score: '98% Match',
    marketPotential: 'Explosive ($90B)',
    difficulty: 'Advanced',
    revenueModel: 'Per-Visit Fee ($35) + Insurance Claim',
    timeToMVP: '4 Weeks',
    problem: 'Patients face long wait times for primary care consultations, while ER rooms are clogged with non-emergencies.',
    solution: 'AI-powered triage app that analyzes patient symptoms, pre-orders lab panels, and routes urgent cases to doctors.',
    fullIdeaText: 'Startup Name: TeleHealth AI. Industry: Healthcare. Problem: Patients face long wait times for primary care consultations. Solution: AI telemedicine platform with automated pre-consultation triage.'
  },
  {
    title: 'Mental Health CBT AI Companion & Wellness Coach',
    category: 'Healthcare',
    type: 'Mobile App',
    domains: ['Healthcare', 'AI'],
    score: '96% Match',
    marketPotential: 'High ($16B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly Subscription ($14.99/mo)',
    timeToMVP: '2 Weeks',
    problem: '1 in 4 adults suffer from anxiety or burnout, but human therapy is unaffordable ($150/hr).',
    solution: '24/7 empathetic AI mental health companion providing CBT journaling, mood tracking, and emergency therapist routing.',
    fullIdeaText: 'Startup Name: MindEase AI. Industry: Healthcare. Problem: Human therapy is expensive ($150/hr). Solution: 24/7 empathetic AI mental health companion offering CBT journaling.'
  },
  {
    title: 'Hospital Management & Predictive Bed Allocation AI',
    category: 'Healthcare',
    type: 'B2B',
    domains: ['Healthcare'],
    score: '95% Match',
    marketPotential: 'High ($28B)',
    difficulty: 'Advanced',
    revenueModel: 'Enterprise Hospital SLA ($5k+/mo)',
    timeToMVP: '4 Weeks',
    problem: 'Hospitals experience bed allocation delays, nurse burnout, and inefficient ER patient discharge workflows.',
    solution: 'Predictive AI operating system for hospitals that optimizes bed turnover, staffing schedules, and ER patient flow.',
    fullIdeaText: 'Startup Name: CarePulse AI. Industry: Healthcare. Problem: Hospitals suffer bed allocation delays and ER bottlenecking. Solution: Predictive AI operating system optimizing hospital bed turnover and staffing.'
  },
  {
    title: 'Personalized AI Fitness Coach & Form Tracker',
    category: 'Healthcare',
    type: 'Mobile App',
    domains: ['Healthcare'],
    score: '93% Match',
    marketPotential: 'Growing ($12B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly App Pass ($19.99/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Personal trainers are costly ($80/hr), and solo gym-goers perform exercises with poor form leading to injuries.',
    solution: 'Mobile AI fitness coach that uses computer vision to track workout form in real-time and adapt training routines.',
    fullIdeaText: 'Startup Name: FormFit AI. Industry: Healthcare. Problem: Solo gym-goers perform exercises with poor form leading to injury. Solution: Mobile AI fitness coach using computer vision for real-time form correction.'
  },
  {
    title: 'Smart Medicine Reminder & Drug Interaction App',
    category: 'Healthcare',
    type: 'Mobile App',
    domains: ['Healthcare'],
    score: '92% Match',
    marketPotential: 'Growing ($6B)',
    difficulty: 'Beginner',
    revenueModel: 'Freemium + Family Plan ($9.99/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Elderly and chronic patients forget daily prescription doses or suffer dangerous unflagged drug interactions.',
    solution: 'Smart medication reminder app that scans prescription labels, warns against adverse interactions, and alerts family.',
    fullIdeaText: 'Startup Name: PillTracker AI. Industry: Healthcare. Problem: Elderly patients forget prescription doses or suffer drug interactions. Solution: Smart medication app scanning labels and alerting caregivers.'
  },
  {
    title: 'Predictive Health & Disease Risk Analytics Platform',
    category: 'Healthcare',
    type: 'SaaS',
    domains: ['Healthcare', 'AI'],
    score: '97% Match',
    marketPotential: 'Explosive ($35B)',
    difficulty: 'Advanced',
    revenueModel: 'Enterprise B2B or Insurance License',
    timeToMVP: '4 Weeks',
    problem: 'Preventable chronic illnesses (diabetes, cardiovascular disease) are diagnosed too late due to infrequent checkups.',
    solution: 'AI health intelligence app aggregating Apple Watch and Oura Ring data to predict early sickness and metabolic risks.',
    fullIdeaText: 'Startup Name: BioSense AI. Industry: Healthcare. Problem: Preventable chronic diseases are diagnosed too late. Solution: AI health intelligence app analyzing wearable biometric data to predict sickness risks.'
  },
  {
    title: 'AI Nutrition & Personalized Diet Recommendation Planner',
    category: 'Healthcare',
    type: 'Mobile App',
    domains: ['Healthcare'],
    score: '91% Match',
    marketPotential: 'Growing ($8B)',
    difficulty: 'Beginner',
    revenueModel: 'Monthly Subscription ($12.99/mo)',
    timeToMVP: '2 Weeks',
    problem: 'People struggle to adhere to diets because standard meal plans do not account for personal blood lab metrics or tastes.',
    solution: 'AI nutritionist that generates weekly grocery lists and recipe plans based on user blood biomarkers and fitness goals.',
    fullIdeaText: 'Startup Name: NutriPlan AI. Industry: Healthcare. Problem: Standard meal plans ignore blood biomarkers and dietary tastes. Solution: AI nutritionist generating weekly meal plans aligned with health goals.'
  },
  {
    title: 'Remote Patient Monitoring & IoT Health Tracker',
    category: 'Healthcare',
    type: 'B2B',
    domains: ['Healthcare'],
    score: '94% Match',
    marketPotential: 'High ($22B)',
    difficulty: 'Advanced',
    revenueModel: 'Device Fee + Monthly SaaS Subscription',
    timeToMVP: '4 Weeks',
    problem: 'Post-surgery patients require continuous vital monitoring after hospital discharge to prevent readmission.',
    solution: 'IoT pulse-oximeter and ECG patch system streaming real-time vitals to hospital dashboards with AI anomaly alerts.',
    fullIdeaText: 'Startup Name: PulseConnect. Industry: Healthcare. Problem: Post-surgery patients require vital monitoring post-discharge. Solution: IoT vitals patch streaming patient data with AI risk alerts to doctors.'
  },
  {
    title: 'AI Medical & Blood Lab Report Analyzer',
    category: 'Healthcare',
    type: 'AI Product',
    domains: ['Healthcare', 'AI'],
    score: '96% Match',
    marketPotential: 'High ($10B)',
    difficulty: 'Intermediate',
    revenueModel: 'Pay-per-Report ($5) or $15/mo Unlimited',
    timeToMVP: '2 Weeks',
    problem: 'Patients receive complex blood test lab reports online without understanding what abnormal markers mean.',
    solution: 'AI diagnostic helper that translates lab reports into plain-language summaries with targeted lifestyle questions for doctors.',
    fullIdeaText: 'Startup Name: LabDecoder AI. Industry: Healthcare. Problem: Patients cannot interpret complex blood lab results. Solution: AI helper explaining lab report markers in plain language.'
  },
  {
    title: 'Elderly Care Assistant & Emergency Alert Network',
    category: 'Healthcare',
    type: 'Mobile App',
    domains: ['Healthcare'],
    score: '93% Match',
    marketPotential: 'High ($15B)',
    difficulty: 'Intermediate',
    revenueModel: 'Family Safety Subscription ($24.99/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Seniors living alone face high fall risks and delayed emergency response when family members are away.',
    solution: 'Smart caregiver app utilizing phone accelerometer AI to detect falls, track daily mobility, and alert relatives instantly.',
    fullIdeaText: 'Startup Name: SeniorGuard AI. Industry: Healthcare. Problem: Seniors living alone face high fall risks. Solution: Smart phone app detecting falls and alerting family members instantly.'
  },

  // 🎓 3. EDUCATION DOMAIN (10 Ideas)
  {
    title: 'AI Personalized Learning Tutor',
    category: 'Education',
    type: 'SaaS',
    domains: ['Education', 'AI'],
    score: '98% Match',
    marketPotential: 'Explosive ($25B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly Student Pass ($15/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Students learn at different speeds and get left behind in crowded traditional classrooms.',
    solution: 'Adaptive AI tutor that identifies student learning gaps and creates interactive step-by-step visual lessons.',
    fullIdeaText: 'Startup Name: EduAI Tutor. Industry: Education. Problem: Students get left behind in crowded classrooms. Solution: Adaptive AI tutor creating step-by-step interactive lessons.'
  },
  {
    title: 'Adaptive Coding Practice & Debugging Platform',
    category: 'Education',
    type: 'SaaS',
    domains: ['Education', 'AI'],
    score: '97% Match',
    marketPotential: 'High ($12B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly Subscription ($25/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Beginner coders get stuck on syntax errors and lack instant feedback on code structure.',
    solution: 'Interactive coding sandbox with real-time AI code hints, unit test generation, and adaptive difficulty problems.',
    fullIdeaText: 'Startup Name: CodeMentor AI. Industry: Education. Problem: Beginner coders get stuck on syntax errors. Solution: Coding sandbox with real-time AI debugging hints and test generation.'
  },
  {
    title: 'Technical Mock Interview & Speech Simulator',
    category: 'Education',
    type: 'SaaS',
    domains: ['Education', 'AI'],
    score: '96% Match',
    marketPotential: 'High ($9B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly Subscription ($19/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Graduates fail software engineering interviews due to lack of mock verbal practice.',
    solution: 'Voice-driven AI interviewer conducting mock coding and system design interviews with instant feedback.',
    fullIdeaText: 'Startup Name: InterviewPilot AI. Industry: Education. Problem: Graduates fail tech interviews due to lack of verbal practice. Solution: Voice-driven AI mock interviewer giving real-time feedback.'
  },
  {
    title: 'Interactive Language Learning AI Tutor',
    category: 'Education',
    type: 'Mobile App',
    domains: ['Education'],
    score: '95% Match',
    marketPotential: 'High ($18B)',
    difficulty: 'Beginner',
    revenueModel: 'Freemium + Pro ($9.99/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Language learners memorize vocabulary but freeze when having real conversational dialogue with native speakers.',
    solution: 'AI conversational partner providing real-time voice conversations, grammar correction, and accent feedback.',
    fullIdeaText: 'Startup Name: LinguaAI. Industry: Education. Problem: Language learners freeze during real conversations. Solution: AI conversational partner giving real-time voice dialogue and grammar hints.'
  },
  {
    title: 'AI Exam Prep & Practice Quiz Generator',
    category: 'Education',
    type: 'Mobile App',
    domains: ['Education'],
    score: '93% Match',
    marketPotential: 'Growing ($7B)',
    difficulty: 'Beginner',
    revenueModel: 'Monthly Pass ($12/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Students spend hours manually creating flashcards and practice test questions before major exams.',
    solution: 'AI app that converts lecture slides and PDFs into instant practice quizzes, flashcards, and weak-spot diagnostics.',
    fullIdeaText: 'Startup Name: QuizGenie AI. Industry: Education. Problem: Students spend hours creating study flashcards. Solution: AI app converting PDFs into instant practice quizzes and flashcards.'
  },
  {
    title: 'AI Career Guidance & Skill Pathways Portal',
    category: 'Education',
    type: 'SaaS',
    domains: ['Education'],
    score: '91% Match',
    marketPotential: 'Growing ($6B)',
    difficulty: 'Beginner',
    revenueModel: 'University License or B2C $15/mo',
    timeToMVP: '2 Weeks',
    problem: 'College students graduate without knowing which tech skills are required for their target job roles.',
    solution: 'AI career advisor that analyzes resume skill gaps and maps out step-by-step course recommendations for target jobs.',
    fullIdeaText: 'Startup Name: CareerPath AI. Industry: Education. Problem: Students graduate without clear tech skill roadmaps. Solution: AI advisor analyzing resume skill gaps and creating career learning paths.'
  },
  {
    title: 'Smart Classroom Analytics & Engagement AI',
    category: 'Education',
    type: 'B2B',
    domains: ['Education'],
    score: '90% Match',
    marketPotential: 'Growing ($5B)',
    difficulty: 'Intermediate',
    revenueModel: 'School District License ($1k/school/yr)',
    timeToMVP: '3 Weeks',
    problem: 'Schools lack real-time visibility into student attendance trends, engagement levels, and dropout risks.',
    solution: 'Smart school analytics platform tracking student attendance patterns and alerting counselors to early academic risk.',
    fullIdeaText: 'Startup Name: ClassPulse. Industry: Education. Problem: Schools lack visibility into student attendance and dropout risk. Solution: School analytics platform alerting counselors to academic risks.'
  },
  {
    title: 'Student Performance & Parent Insights Dashboard',
    category: 'Education',
    type: 'SaaS',
    domains: ['Education'],
    score: '92% Match',
    marketPotential: 'Growing ($8B)',
    difficulty: 'Beginner',
    revenueModel: 'Parent Subscription ($5/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Parents struggle to track their children\'s daily homework completion and test performance across multiple apps.',
    solution: 'Unified mobile dashboard summarizing student grades, upcoming assignment deadlines, and AI study tips for parents.',
    fullIdeaText: 'Startup Name: EduParent AI. Industry: Education. Problem: Parents struggle to track student progress across multiple apps. Solution: Unified mobile dashboard summarizing grades and assignment deadlines.'
  },
  {
    title: 'Automated Lecture Note & Summary Generator',
    category: 'Education',
    type: 'AI Product',
    domains: ['Education', 'AI'],
    score: '94% Match',
    marketPotential: 'High ($10B)',
    difficulty: 'Beginner',
    revenueModel: 'Freemium + $8/mo Student Pass',
    timeToMVP: '2 Weeks',
    problem: 'Students miss key points during fast-paced 1-hour university lectures while taking manual notes.',
    solution: 'Voice AI note-taker that records lectures, transcribes audio, and outputs structured bulleted notes and mindmaps.',
    fullIdeaText: 'Startup Name: LectureNotes AI. Industry: Education. Problem: Students miss key points taking manual lecture notes. Solution: Voice AI note-taker converting lecture audio into structured bullet notes.'
  },
  {
    title: 'Academic Literature Search & Citation Assistant',
    category: 'Education',
    type: 'AI Product',
    domains: ['Education', 'AI'],
    score: '95% Match',
    marketPotential: 'Growing ($6B)',
    difficulty: 'Intermediate',
    revenueModel: 'Pro Plan ($14/mo)',
    timeToMVP: '2 Weeks',
    problem: 'University researchers waste days searching databases for relevant literature and formatting citations.',
    solution: 'AI assistant that indexes millions of open-access papers, summarizes findings, and formats APA/IEEE citations.',
    fullIdeaText: 'Startup Name: ScholarSearch AI. Industry: Education. Problem: Researchers waste days searching databases and formatting citations. Solution: AI assistant summarizing academic papers and formatting citations.'
  },

  // 💰 4. FINANCE DOMAIN (10 Ideas)
  {
    title: 'AI Personal Expense Tracker & CFO',
    category: 'Finance',
    type: 'Mobile App',
    domains: ['Finance', 'AI'],
    score: '96% Match',
    marketPotential: 'Explosive ($20B)',
    difficulty: 'Intermediate',
    revenueModel: 'Freemium + Pro ($9.99/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Young professionals overspend and struggle to build monthly savings due to lack of visibility into bank accounts.',
    solution: 'AI personal CFO that auto-categorizes bank transactions, predicts cash flow, and suggests smart savings goals.',
    fullIdeaText: 'Startup Name: PocketCFO AI. Industry: Finance. Problem: Young professionals overspend due to lack of bank account visibility. Solution: AI CFO auto-categorizing transactions and suggesting savings.'
  },
  {
    title: 'AI Investment & Portfolio Wealth Advisor',
    category: 'Finance',
    type: 'SaaS',
    domains: ['Finance', 'AI'],
    score: '97% Match',
    marketPotential: 'Explosive ($30B)',
    difficulty: 'Advanced',
    revenueModel: '0.25% AUM Fee or Monthly $19/mo',
    timeToMVP: '4 Weeks',
    problem: 'Retail investors lack access to sophisticated institutional portfolio risk management and asset allocation.',
    solution: 'Robo-advisor powered by AI that rebalances stock/ETF portfolios automatically based on individual risk tolerance.',
    fullIdeaText: 'Startup Name: WealthPilot AI. Industry: Finance. Problem: Retail investors lack institutional portfolio risk management. Solution: AI robo-advisor rebalancing portfolios based on risk tolerance.'
  },
  {
    title: 'AI Real-Time Fraud & Anomaly Detection Platform',
    category: 'Finance',
    type: 'B2B',
    domains: ['Finance', 'Cybersecurity', 'AI'],
    score: '99% Match',
    marketPotential: 'Explosive ($40B)',
    difficulty: 'Advanced',
    revenueModel: 'Usage-Based API ($0.05/transaction)',
    timeToMVP: '4 Weeks',
    problem: 'Payment gateways and merchants lose billions to online card-not-present fraud and account takeover attacks.',
    solution: 'Real-time transaction risk scoring API using behavioral biometrics and device fingerprinting to block fraud.',
    fullIdeaText: 'Startup Name: ShieldPay AI. Industry: Finance. Problem: Payment gateways lose billions to card fraud. Solution: Real-time risk scoring API using device fingerprinting to block fraud.'
  },
  {
    title: 'AI Credit Risk Analyzer & Loan Approval Insights',
    category: 'Finance',
    type: 'B2B',
    domains: ['Finance', 'AI'],
    score: '95% Match',
    marketPotential: 'High ($18B)',
    difficulty: 'Advanced',
    revenueModel: 'Per-Applicant Scan ($5/scan)',
    timeToMVP: '4 Weeks',
    problem: 'Fintech lenders reject creditworthy thin-file applicants due to outdated traditional FICO scoring models.',
    solution: 'Alternative credit scoring engine evaluating bank cash flows, utility payments, and income stability with AI.',
    fullIdeaText: 'Startup Name: CreditWise AI. Industry: Finance. Problem: Lenders reject creditworthy applicants using traditional FICO scores. Solution: Alternative credit scoring engine evaluating bank cash flows.'
  },
  {
    title: 'Automated Invoice Processing & Accounts Payable AI',
    category: 'Finance',
    type: 'SaaS',
    domains: ['Finance', 'AI'],
    score: '96% Match',
    marketPotential: 'High ($15B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly SaaS ($99 - $499/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Finance teams manually key vendor invoice details into ERP accounting systems, causing delays and errors.',
    solution: 'OCR & AI invoice processing engine that extracts line items from PDF invoices and syncs them to QuickBooks.',
    fullIdeaText: 'Startup Name: InvoiceMind AI. Industry: Finance. Problem: Finance teams manually key invoice data into accounting tools. Solution: OCR & AI engine extracting line items from PDF invoices.'
  },
  {
    title: 'Smart AI Budget Planner & Savings Optimizer',
    category: 'Finance',
    type: 'Mobile App',
    domains: ['Finance'],
    score: '92% Match',
    marketPotential: 'Growing ($8B)',
    difficulty: 'Beginner',
    revenueModel: 'Monthly Subscription ($7.99/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Families struggle to budget for major life goals (home down payment, vacations) amid inflation.',
    solution: 'Smart budgeting app that analyzes household bills and automatically transfers spare funds to high-yield savings.',
    fullIdeaText: 'Startup Name: SaveSmart AI. Industry: Finance. Problem: Families struggle to budget for major life financial goals. Solution: Budgeting app analyzing household bills and automating savings.'
  },
  {
    title: 'AI Tax Filing Assistant & Deduction Finder',
    category: 'Finance',
    type: 'SaaS',
    domains: ['Finance', 'AI'],
    score: '94% Match',
    marketPotential: 'High ($14B)',
    difficulty: 'Intermediate',
    revenueModel: 'Per-Filing Fee ($39 - $89)',
    timeToMVP: '3 Weeks',
    problem: 'Freelancers and small business owners miss out on thousands in legal tax write-offs every year.',
    solution: 'AI tax co-pilot that scans bank receipts, identifies eligible business tax deductions, and prepares tax forms.',
    fullIdeaText: 'Startup Name: TaxGenie AI. Industry: Finance. Problem: Freelancers miss out on thousands in legal tax write-offs. Solution: AI tax assistant scanning bank receipts to find business write-offs.'
  },
  {
    title: 'Crypto & NFT Portfolio Manager & Tax Tracker',
    category: 'Finance',
    type: 'SaaS',
    domains: ['Finance'],
    score: '91% Match',
    marketPotential: 'Growing ($9B)',
    difficulty: 'Intermediate',
    revenueModel: 'Annual Tax Report Fee ($49 - $199)',
    timeToMVP: '3 Weeks',
    problem: 'Crypto traders struggle to calculate capital gains taxes across multiple exchanges and DeFi wallets.',
    solution: 'Unified crypto dashboard syncing wallet transactions across blockchains to calculate capital gains taxes.',
    fullIdeaText: 'Startup Name: CoinTax AI. Industry: Finance. Problem: Crypto traders struggle to calculate taxes across exchanges. Solution: Unified dashboard syncing wallet transactions to compute capital gains.'
  },
  {
    title: 'AI Accounting & Bookkeeping Automation Assistant',
    category: 'Finance',
    type: 'SaaS',
    domains: ['Finance', 'AI'],
    score: '97% Match',
    marketPotential: 'Explosive ($22B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly Plan ($49/mo per company)',
    timeToMVP: '3 Weeks',
    problem: 'Small business owners spend weekends manually reconciling bank statements and matching receipts.',
    solution: 'AI bookkeeper that reconciles monthly bank statements, categorizes expenses, and generates P&L statements.',
    fullIdeaText: 'Startup Name: BookkeepAI. Industry: Finance. Problem: Small business owners spend weekends manually reconciling accounts. Solution: AI bookkeeper reconciling bank statements and outputting P&L reports.'
  },
  {
    title: 'Subscription Expense Manager & Churn Blocker',
    category: 'Finance',
    type: 'Mobile App',
    domains: ['Finance'],
    score: '93% Match',
    marketPotential: 'Growing ($7B)',
    difficulty: 'Beginner',
    revenueModel: '15% of Cancelled Savings',
    timeToMVP: '2 Weeks',
    problem: 'Consumers lose up to $500/year on forgotten free trials and unwanted recurring SaaS subscriptions.',
    solution: 'Smart finance app that identifies all active recurring subscriptions and cancels unwanted ones with one tap.',
    fullIdeaText: 'Startup Name: CancelBot AI. Industry: Finance. Problem: Consumers lose money on forgotten paid subscriptions. Solution: Smart app identifying recurring payments and cancelling unwanted subscriptions.'
  },

  // 🔒 5. CYBERSECURITY DOMAIN (10 Ideas)
  {
    title: 'AI Real-Time Threat Detection Platform',
    category: 'Cybersecurity',
    type: 'B2B',
    domains: ['Cybersecurity', 'AI'],
    score: '99% Match',
    marketPotential: 'Explosive ($45B)',
    difficulty: 'Advanced',
    revenueModel: 'Enterprise Node SLA ($2k+/mo)',
    timeToMVP: '4 Weeks',
    problem: 'Enterprise networks take over 200 days on average to detect hidden zero-day malware intrusion attempts.',
    solution: 'Behavioral AI anomaly detection engine monitoring network traffic in real time to isolate cyber attacks.',
    fullIdeaText: 'Startup Name: ThreatShield AI. Industry: Cybersecurity. Problem: Enterprise networks take 200+ days to detect malware intrusions. Solution: Behavioral AI engine monitoring traffic and isolating cyber attacks.'
  },
  {
    title: 'Autonomous Vulnerability Scanner & Remediator',
    category: 'Cybersecurity',
    type: 'SaaS',
    domains: ['Cybersecurity', 'AI'],
    score: '98% Match',
    marketPotential: 'Explosive ($30B)',
    difficulty: 'Advanced',
    revenueModel: 'Monthly SaaS ($99 - $499/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Cloud misconfigurations on AWS/GCP leave 65% of startups vulnerable to catastrophic data breaches.',
    solution: 'Autonomous vulnerability scanner auditing cloud security configurations and auto-closing open ports.',
    fullIdeaText: 'Startup Name: CloudGuard AI. Industry: Cybersecurity. Problem: Cloud misconfigurations leave startups exposed to breaches. Solution: Autonomous vulnerability scanner auditing cloud security and fixing ports.'
  },
  {
    title: 'AI Zero-Trust Identity & KYC Verification API',
    category: 'Cybersecurity',
    type: 'B2B',
    domains: ['Cybersecurity', 'Finance'],
    score: '96% Match',
    marketPotential: 'High ($20B)',
    difficulty: 'Advanced',
    revenueModel: 'Per-Verification API Fee ($1.50/scan)',
    timeToMVP: '3 Weeks',
    problem: 'Online Fintech onboarding suffers high drop-off due to slow manual passport and ID document checks.',
    solution: 'Instant AI liveness verification and government ID OCR SDK completing KYC checks in under 3 seconds.',
    fullIdeaText: 'Startup Name: VerifiID AI. Industry: Cybersecurity. Problem: Online KYC onboarding suffers high drop-off. Solution: Instant AI liveness and government ID OCR SDK completing KYC in 3 seconds.'
  },
  {
    title: 'Zero-Knowledge Password & Credential Security Vault',
    category: 'Cybersecurity',
    type: 'SaaS',
    domains: ['Cybersecurity'],
    score: '93% Match',
    marketPotential: 'High ($12B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly Subscription ($5 - $15/user/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Employees reuse weak passwords across company accounts, leading to credential stuffing breaches.',
    solution: 'Zero-knowledge password manager providing AES-256 encrypted vaults, SSO integration, and breach alerts.',
    fullIdeaText: 'Startup Name: VaultKey. Industry: Cybersecurity. Problem: Employees reuse weak passwords leading to credential breaches. Solution: Zero-knowledge password manager with AES-256 encrypted vaults.'
  },
  {
    title: 'Behavioral Malware Detection AI Engine',
    category: 'Cybersecurity',
    type: 'B2B',
    domains: ['Cybersecurity', 'AI'],
    score: '97% Match',
    marketPotential: 'High ($25B)',
    difficulty: 'Advanced',
    revenueModel: 'Endpoint License ($8/device/mo)',
    timeToMVP: '4 Weeks',
    problem: 'Traditional signature-based antivirus software fails to block newly compiled polymorphic ransomware attacks.',
    solution: 'Next-gen endpoint AI agent detecting malware based on runtime process behavior rather than static signatures.',
    fullIdeaText: 'Startup Name: MalwareGuard AI. Industry: Cybersecurity. Problem: Traditional antivirus fails to block new ransomware attacks. Solution: Endpoint AI agent detecting malware based on runtime process behavior.'
  },
  {
    title: 'AI Email Phishing & Spam Detector',
    category: 'Cybersecurity',
    type: 'SaaS',
    domains: ['Cybersecurity', 'AI'],
    score: '94% Match',
    marketPotential: 'High ($14B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly Inbox License ($4/inbox/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Employees fall victim to sophisticated spear-phishing emails posing as company CEOs or vendors.',
    solution: 'Google Workspace and Outlook AI plugin analyzing email headers, tone, and links to quarantine phishing attempts.',
    fullIdeaText: 'Startup Name: PhishBlock AI. Industry: Cybersecurity. Problem: Employees fall victim to spear-phishing emails posing as executives. Solution: Email AI plugin analyzing headers and links to block phishing.'
  },
  {
    title: 'Security Operations Center (SOC) Monitoring Platform',
    category: 'Cybersecurity',
    type: 'B2B',
    domains: ['Cybersecurity'],
    score: '95% Match',
    marketPotential: 'Explosive ($32B)',
    difficulty: 'Advanced',
    revenueModel: 'Enterprise Monthly Plan ($1.5k/mo)',
    timeToMVP: '4 Weeks',
    problem: 'Small security teams are flooded with thousands of daily SIEM log alerts, causing critical fatigue.',
    solution: 'Unified SOC dashboard using AI alert prioritization to highlight top 1% critical threats requiring action.',
    fullIdeaText: 'Startup Name: SOCPulse AI. Industry: Cybersecurity. Problem: Security teams are flooded with thousands of daily log alerts. Solution: Unified SOC dashboard using AI to prioritize top critical threats.'
  },
  {
    title: 'Automated Continuous Compliance Manager (SOC2/HIPAA)',
    category: 'Cybersecurity',
    type: 'SaaS',
    domains: ['Cybersecurity'],
    score: '98% Match',
    marketPotential: 'Explosive ($28B)',
    difficulty: 'Intermediate',
    revenueModel: 'Annual SaaS Subscription ($3k - $12k/yr)',
    timeToMVP: '3 Weeks',
    problem: 'SaaS startups spend $50k+ on security consultants to manually collect SOC2 and HIPAA audit evidence.',
    solution: 'Automated continuous compliance platform connecting to GitHub, AWS, and Slack to keep companies audit-ready.',
    fullIdeaText: 'Startup Name: ComplyAI. Industry: Cybersecurity. Problem: Startups spend $50k+ on consultants for SOC2 evidence. Solution: Automated compliance platform connecting to AWS and GitHub for evidence collection.'
  },
  {
    title: 'Blockchain Digital Certificate & Diploma Authenticator',
    category: 'Cybersecurity',
    type: 'B2B',
    domains: ['Cybersecurity'],
    score: '91% Match',
    marketPotential: 'Growing ($8B)',
    difficulty: 'Intermediate',
    revenueModel: 'Per-Certificate Minting Fee ($1)',
    timeToMVP: '3 Weeks',
    problem: 'Educational diplomas, professional credentials, and luxury goods certificates are easily counterfeited.',
    solution: 'Decentralized digital credential issuing platform leveraging blockchain proof of authenticity.',
    fullIdeaText: 'Startup Name: ChainVerify. Industry: Cybersecurity. Problem: Educational diplomas and certificates are easily counterfeited. Solution: Blockchain digital credential platform providing cryptographic proof of authenticity.'
  },
  {
    title: 'Interactive Cybersecurity Awareness Training Platform',
    category: 'Cybersecurity',
    type: 'SaaS',
    domains: ['Cybersecurity'],
    score: '92% Match',
    marketPotential: 'Growing ($10B)',
    difficulty: 'Beginner',
    revenueModel: 'Seat Licensing ($3/employee/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Corporate security training consists of boring annual video lectures that employees skip without learning.',
    solution: 'Gamified security training platform delivering 2-minute interactive micro-modules and simulated phishing tests.',
    fullIdeaText: 'Startup Name: SecurTrain AI. Industry: Cybersecurity. Problem: Corporate security training consists of boring videos employees skip. Solution: Gamified security platform delivering micro-modules and phishing tests.'
  },

  // 🌾 6. AGRICULTURE DOMAIN (10 Ideas)
  {
    title: 'Smart Farming Analytics & Yield Dashboard',
    category: 'AgriTech',
    type: 'SaaS',
    domains: ['Agriculture'],
    score: '95% Match',
    marketPotential: 'High ($18B)',
    difficulty: 'Intermediate',
    revenueModel: 'Per-Acre Monthly Subscription',
    timeToMVP: '3 Weeks',
    problem: 'Commercial farmers struggle to track soil health, crop growth cycles, and equipment maintenance in one place.',
    solution: 'Unified farm management dashboard consolidating IoT soil sensor data, weather forecasts, and crop health metrics.',
    fullIdeaText: 'Startup Name: SmartFarm AI. Industry: Agriculture. Problem: Farmers struggle to track soil health and crop growth in one place. Solution: Unified farm dashboard consolidating IoT sensor data and weather metrics.'
  },
  {
    title: 'AI Crop Disease & Leaf Infection Detector',
    category: 'AgriTech',
    type: 'Mobile App',
    domains: ['Agriculture', 'AI'],
    score: '96% Match',
    marketPotential: 'High ($12B)',
    difficulty: 'Beginner',
    revenueModel: 'Freemium + $15/mo Agronomist Plan',
    timeToMVP: '2 Weeks',
    problem: 'Farmers lose up to 30% of crop yields due to undetected leaf fungal infections and pest attacks.',
    solution: 'Mobile app using smartphone camera computer vision to instantly identify crop diseases and recommend treatments.',
    fullIdeaText: 'Startup Name: CropDoctor AI. Industry: Agriculture. Problem: Farmers lose crop yield to undetected leaf fungal infections. Solution: Mobile camera app identifying crop diseases and suggesting treatments.'
  },
  {
    title: 'Micro-Climate Weather & Frost Prediction Platform',
    category: 'AgriTech',
    type: 'SaaS',
    domains: ['Agriculture'],
    score: '93% Match',
    marketPotential: 'Growing ($9B)',
    difficulty: 'Intermediate',
    revenueModel: 'Farm Monthly Subscription ($29/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Unexpected hyper-local frost events and heavy rain ruin delicate fruit harvests without advance warning.',
    solution: 'Hyper-local weather platform combining local IoT station data and satellite models to predict farm frost risks.',
    fullIdeaText: 'Startup Name: AgriWeather AI. Industry: Agriculture. Problem: Unexpected local frost events ruin fruit harvests without warning. Solution: Micro-climate weather platform predicting farm frost risks.'
  },
  {
    title: 'IoT Livestock Health & Estrus Tracking System',
    category: 'AgriTech',
    type: 'B2B',
    domains: ['Agriculture'],
    score: '94% Match',
    marketPotential: 'High ($14B)',
    difficulty: 'Advanced',
    revenueModel: 'Hardware Collar + Monthly Service Fee',
    timeToMVP: '4 Weeks',
    problem: 'Ranchers miss optimal breeding windows and lose cattle to unmonitored early illnesses.',
    solution: 'Smart IoT wearable collar for cattle tracking temperature, rumination, and heat cycles with mobile alerts.',
    fullIdeaText: 'Startup Name: CattlePulse IoT. Industry: Agriculture. Problem: Ranchers miss breeding windows and lose cattle to unmonitored illness. Solution: IoT wearable collar tracking cattle temperature and heat cycles.'
  },
  {
    title: 'Smart Automated Irrigation Controller',
    category: 'AgriTech',
    type: 'Hardware & AI',
    domains: ['Agriculture'],
    score: '92% Match',
    marketPotential: 'Growing ($10B)',
    difficulty: 'Intermediate',
    revenueModel: 'Controller Sales + Cloud Subscription',
    timeToMVP: '3 Weeks',
    problem: 'Farmers waste up to 40% of irrigation water due to rigid timer schedules that ignore soil moisture.',
    solution: 'Smart irrigation valve controller using soil moisture sensors and weather forecasts to irrigate crops efficiently.',
    fullIdeaText: 'Startup Name: AquaFarm AI. Industry: Agriculture. Problem: Farmers waste irrigation water using rigid timer schedules. Solution: Smart irrigation valve controller adjusting watering based on soil moisture.'
  },
  {
    title: 'AI Soil NPK Analyzer & Fertilizer Recommendation Engine',
    category: 'AgriTech',
    type: 'SaaS',
    domains: ['Agriculture', 'AI'],
    score: '95% Match',
    marketPotential: 'High ($11B)',
    difficulty: 'Intermediate',
    revenueModel: 'Per-Soil Test Scan ($10)',
    timeToMVP: '2 Weeks',
    problem: 'Over-fertilization damages soil health and wastes money on expensive chemical inputs.',
    solution: 'AI soil analysis app that evaluates soil test reports and recommends exact organic fertilizer blends.',
    fullIdeaText: 'Startup Name: SoilSense AI. Industry: Agriculture. Problem: Over-fertilization damages soil health and wastes chemical inputs. Solution: AI soil app analyzing lab reports to recommend precise fertilizer blends.'
  },
  {
    title: 'Farmer-to-Buyer Direct Agri Marketplace',
    category: 'AgriTech',
    type: 'Marketplace',
    domains: ['Agriculture'],
    score: '94% Match',
    marketPotential: 'Explosive ($40B)',
    difficulty: 'Intermediate',
    revenueModel: '3-5% Transaction Commission',
    timeToMVP: '3 Weeks',
    problem: 'Farmers receive low margins selling produce through long chains of predatory middlemen.',
    solution: 'Direct B2B marketplace connecting farmers directly with restaurant chains, grocery stores, and food processors.',
    fullIdeaText: 'Startup Name: DirectAgri Market. Industry: Agriculture. Problem: Farmers receive low margins selling through middleman chains. Solution: Direct B2B marketplace connecting farmers with grocery stores.'
  },
  {
    title: 'Drone Aerial Crop Monitoring & Field Inspector',
    category: 'AgriTech',
    type: 'AI Product',
    domains: ['Agriculture', 'AI'],
    score: '96% Match',
    marketPotential: 'High ($15B)',
    difficulty: 'Advanced',
    revenueModel: 'Per-Flight Mapping Service ($5/acre)',
    timeToMVP: '4 Weeks',
    problem: 'Inspecting large multi-hundred acre farmland manually on foot is slow and misses localized crop stress.',
    solution: 'Autonomous drone flight software that captures multispectral field maps and highlights weed outbreak zones.',
    fullIdeaText: 'Startup Name: DroneAgri AI. Industry: Agriculture. Problem: Inspecting large farmland manually on foot misses localized crop stress. Solution: Drone software capturing multispectral maps to highlight weed zones.'
  },
  {
    title: 'AI Harvest Yield Prediction & Pricing Forecaster',
    category: 'AgriTech',
    type: 'SaaS',
    domains: ['Agriculture', 'AI'],
    score: '93% Match',
    marketPotential: 'Growing ($8B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly SaaS ($49/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Agricultural traders and farmers struggle to price crops before harvest due to volatile yield uncertainty.',
    solution: 'Predictive machine learning model evaluating satellite vegetation indices to forecast harvest tonnage and market prices.',
    fullIdeaText: 'Startup Name: YieldCast AI. Industry: Agriculture. Problem: Farmers struggle to price crops before harvest due to yield uncertainty. Solution: Machine learning model analyzing satellite data to forecast tonnage.'
  },
  {
    title: 'Precision Agriculture AI Assistant for Smallholders',
    category: 'AgriTech',
    type: 'Mobile App',
    domains: ['Agriculture', 'AI'],
    score: '91% Match',
    marketPotential: 'Growing ($7B)',
    difficulty: 'Beginner',
    revenueModel: 'Freemium + Seed Company Sponsorship',
    timeToMVP: '2 Weeks',
    problem: 'Smallholder farmers lack access to professional agronomist advice for crop rotation and pest management.',
    solution: 'Voice AI agronomist app answering farming questions in local languages via simple voice messages.',
    fullIdeaText: 'Startup Name: AgriVoice AI. Industry: Agriculture. Problem: Smallholder farmers lack access to professional agronomist advice. Solution: Voice AI agronomist answering farming queries in local languages.'
  },

  // 🏠 7. REAL ESTATE DOMAIN (10 Ideas)
  {
    title: 'AI Personalized Property Recommendation Engine',
    category: 'Real Estate',
    type: 'Marketplace',
    domains: ['Real Estate', 'AI'],
    score: '97% Match',
    marketPotential: 'Explosive ($50B)',
    difficulty: 'Intermediate',
    revenueModel: 'Broker Referral Fee (1-2% of closing)',
    timeToMVP: '3 Weeks',
    problem: 'Homebuyers waste weeks browsing generic listings that fail to match their commute, school, or lifestyle needs.',
    solution: 'AI property matchmaker analyzing buyer preferences to recommend perfect home listings before they hit Zillow.',
    fullIdeaText: 'Startup Name: HomeMatch AI. Industry: Real Estate. Problem: Homebuyers waste time browsing generic listings that miss lifestyle needs. Solution: AI matchmaker recommending homes matching buyer preferences.'
  },
  {
    title: 'Seamless Tenant Rental Marketplace & Screening',
    category: 'Real Estate',
    type: 'Marketplace',
    domains: ['Real Estate'],
    score: '95% Match',
    marketPotential: 'High ($22B)',
    difficulty: 'Intermediate',
    revenueModel: 'Application Fee ($35) + Landlord Subscription',
    timeToMVP: '3 Weeks',
    problem: 'Landlords suffer long vacancy periods and manual credit/background check paperwork for every applicant.',
    solution: 'End-to-end rental portal with instant AI background screening, digital lease signing, and automated rent collection.',
    fullIdeaText: 'Startup Name: RentEase. Industry: Real Estate. Problem: Landlords suffer long vacancy periods and manual applicant paperwork. Solution: Rental portal with instant background checks and digital lease signing.'
  },
  {
    title: 'Smart Property Valuation & Automated CMA Model',
    category: 'Real Estate',
    type: 'SaaS',
    domains: ['Real Estate', 'AI'],
    score: '96% Match',
    marketPotential: 'High ($15B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly SaaS ($49 - $199/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Real estate agents spend hours manually compiling Comparative Market Analysis (CMA) reports for clients.',
    solution: 'AI valuation model evaluating recent sales comps, neighborhood trends, and home upgrades to estimate property value.',
    fullIdeaText: 'Startup Name: ValuProp AI. Industry: Real Estate. Problem: Real estate agents spend hours compiling manual CMA valuation reports. Solution: AI valuation model calculating home value based on comp sales.'
  },
  {
    title: 'Virtual 3D Spatial Property Tour & Staging Platform',
    category: 'Real Estate',
    type: 'AI Product',
    domains: ['Real Estate', 'AI'],
    score: '94% Match',
    marketPotential: 'High ($12B)',
    difficulty: 'Advanced',
    revenueModel: 'Per-Listing Staging Fee ($29)',
    timeToMVP: '3 Weeks',
    problem: 'Physical home staging costs $3,000+ per property and empty home listings receive 50% fewer buyer inquiries.',
    solution: 'Generative AI platform that virtually stages vacant listing photos with photorealistic furniture in any design style.',
    fullIdeaText: 'Startup Name: StageAI. Industry: Real Estate. Problem: Physical home staging costs thousands for vacant properties. Solution: Generative AI platform virtually staging listing photos with photorealistic furniture.'
  },
  {
    title: 'Construction Cost Estimator & Material Budgeting AI',
    category: 'Real Estate',
    type: 'SaaS',
    domains: ['Real Estate'],
    score: '93% Match',
    marketPotential: 'Growing ($10B)',
    difficulty: 'Intermediate',
    revenueModel: 'Contractor SaaS Subscription ($79/mo)',
    timeToMVP: '3 Weeks',
    problem: 'General contractors experience severe cost overruns due to inaccurate manual material bidding and price shifts.',
    solution: 'AI estimating tool that parses architectural blueprints and calculates lumber, concrete, and labor budgets automatically.',
    fullIdeaText: 'Startup Name: BuildEstimate AI. Industry: Real Estate. Problem: Contractors suffer cost overruns from inaccurate manual material bids. Solution: AI estimator tool parsing blueprints to calculate material budgets.'
  },
  {
    title: 'Real Estate Agent AI CRM & Automated Lead Nurturer',
    category: 'Real Estate',
    type: 'SaaS',
    domains: ['Real Estate', 'AI'],
    score: '98% Match',
    marketPotential: 'High ($18B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly Seat ($39/agent/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Real estate agents lose 70% of open-house leads because they fail to follow up consistently over 6-month buying cycles.',
    solution: 'AI-native CRM that automatically sends personalized SMS and email market updates to prospective buyers.',
    fullIdeaText: 'Startup Name: PropAgent AI. Industry: Real Estate. Problem: Agents lose open-house leads due to inconsistent follow-ups. Solution: AI CRM sending automated personalized market updates to prospective buyers.'
  },
  {
    title: 'Tenant Management & Automated Maintenance Platform',
    category: 'Real Estate',
    type: 'B2B',
    domains: ['Real Estate'],
    score: '92% Match',
    marketPotential: 'Growing ($9B)',
    difficulty: 'Intermediate',
    revenueModel: '$2 per Unit per Month',
    timeToMVP: '3 Weeks',
    problem: 'Property managers are inundated with late-night maintenance calls and struggle to dispatch contractors efficiently.',
    solution: 'Tenant portal where AI categorizes repair requests, dispatches preferred local plumbers, and tracks resolution status.',
    fullIdeaText: 'Startup Name: PropManager AI. Industry: Real Estate. Problem: Property managers are flooded with late-night tenant repair calls. Solution: AI portal categorizing maintenance tickets and dispatching contractors.'
  },
  {
    title: 'Generative AI Interior Design & Room Visualizer',
    category: 'Real Estate',
    type: 'Mobile App',
    domains: ['Real Estate', 'AI'],
    score: '95% Match',
    marketPotential: 'High ($14B)',
    difficulty: 'Beginner',
    revenueModel: 'Freemium + Pro ($12.99/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Homeowners struggle to visualize how new furniture or wall paint will look in their living space before buying.',
    solution: 'Mobile app converting smartphone room photos into 3D shoppable room designs with direct Wayfair/IKEA buy links.',
    fullIdeaText: 'Startup Name: RoomVision AI. Industry: Real Estate. Problem: Homeowners cannot visualize new furniture in living spaces. Solution: Mobile app transforming room photos into shoppable 3D renders.'
  },
  {
    title: 'Real Estate Investment & Rental Yield Analyzer',
    category: 'Real Estate',
    type: 'SaaS',
    domains: ['Real Estate'],
    score: '96% Match',
    marketPotential: 'High ($11B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly Subscription ($29/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Short-term and long-term rental investors struggle to calculate cap rates, cash-on-cash return, and tax benefits.',
    solution: 'Investment calculator evaluating property address data, Airbnb rental rates, mortgage costs, and ROI projections.',
    fullIdeaText: 'Startup Name: PropROI AI. Industry: Real Estate. Problem: Rental investors struggle to calculate property cap rates and ROI. Solution: Investment calculator evaluating Airbnb rates and mortgage costs.'
  },
  {
    title: 'AI Mortgage Assistant & Loan Rate Comparison',
    category: 'Real Estate',
    type: 'FinTech',
    domains: ['Real Estate', 'Finance'],
    score: '94% Match',
    marketPotential: 'High ($16B)',
    difficulty: 'Intermediate',
    revenueModel: 'Mortgage Lender Lead Referral Fee',
    timeToMVP: '3 Weeks',
    problem: 'First-time homebuyers find mortgage pre-approval paperwork confusing and overpay on bank interest rates.',
    solution: 'AI mortgage advisor that pre-qualifies buyers, scans bank statements, and compares live rates across 50+ lenders.',
    fullIdeaText: 'Startup Name: MortgageGenie AI. Industry: Real Estate. Problem: Homebuyers find mortgage pre-approval paperwork confusing. Solution: AI mortgage assistant pre-qualifying buyers and comparing live lender rates.'
  },

  // 🎮 8. GAMING DOMAIN (10 Ideas)
  {
    title: 'AI In-Game Companion & Strategic Tactical Coach',
    category: 'Gaming',
    type: 'AI Product',
    domains: ['Gaming', 'AI'],
    score: '97% Match',
    marketPotential: 'Explosive ($25B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly Gamer Subscription ($7.99/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Competitive gamers struggle to analyze opponent strategies and improve match win rates in complex multiplayer games.',
    solution: 'Overlay AI companion providing real-time voice callouts, mini-map awareness alerts, and post-match performance reviews.',
    fullIdeaText: 'Startup Name: GameCoach AI. Industry: Gaming. Problem: Competitive gamers struggle to analyze opponent strategies in real time. Solution: Overlay AI companion giving voice callouts and post-match analytics.'
  },
  {
    title: 'Esports Tournament Management & Bracket Platform',
    category: 'Gaming',
    type: 'Marketplace',
    domains: ['Gaming'],
    score: '94% Match',
    marketPotential: 'High ($12B)',
    difficulty: 'Intermediate',
    revenueModel: '5% Tournament Entry Ticket Fee',
    timeToMVP: '3 Weeks',
    problem: 'Community gaming organizers struggle to manage tournament brackets, verify game scores, and pay out prize pools.',
    solution: 'Automated tournament platform with anti-cheat API match verification, automated brackets, and instant prize payouts.',
    fullIdeaText: 'Startup Name: ArenaPlay. Industry: Gaming. Problem: Organizers struggle to manage tournament brackets and prize payouts. Solution: Automated esports platform with match score verification and prize payouts.'
  },
  {
    title: 'Personalized Game Recommendation Engine',
    category: 'Gaming',
    type: 'Mobile App',
    domains: ['Gaming', 'AI'],
    score: '91% Match',
    marketPotential: 'Growing ($6B)',
    difficulty: 'Beginner',
    revenueModel: 'Game Publisher Affiliate Commission',
    timeToMVP: '2 Weeks',
    problem: 'Gamers waste hours browsing thousands of Steam and mobile titles without finding games matching their niche mood.',
    solution: 'AI recommendation app analyzing Steam play history and mood inputs to suggest hidden-gem indie game titles.',
    fullIdeaText: 'Startup Name: GameFinder AI. Industry: Gaming. Problem: Gamers waste hours searching Steam for games matching their mood. Solution: AI app analyzing play history to suggest hidden-gem game titles.'
  },
  {
    title: 'Location-Based AR Gaming Platform',
    category: 'Gaming',
    type: 'Mobile App',
    domains: ['Gaming'],
    score: '93% Match',
    marketPotential: 'High ($15B)',
    difficulty: 'Advanced',
    revenueModel: 'In-App Purchases & Local Business Ads',
    timeToMVP: '4 Weeks',
    problem: 'Mobile gamers want immersive augmented reality experiences that turn local city landmarks into game arenas.',
    solution: 'AR gaming SDK allowing developers to place virtual territory capture battles at real-world GPS locations.',
    fullIdeaText: 'Startup Name: GeoQuest AR. Industry: Gaming. Problem: Gamers want AR experiences turning real landmarks into game arenas. Solution: AR gaming SDK enabling location-based virtual territory capture battles.'
  },
  {
    title: 'Cloud Gaming Bandwidth & Latency Optimizer',
    category: 'Gaming',
    type: 'SaaS',
    domains: ['Gaming'],
    score: '95% Match',
    marketPotential: 'Explosive ($18B)',
    difficulty: 'Advanced',
    revenueModel: 'Monthly Gamer Pass ($9.99/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Cloud gaming users (GeForce Now, Xbox Cloud) suffer packet loss and input lag during peak internet hours.',
    solution: 'Network routing software using AI to dynamically route gaming traffic over lowest-latency ISP nodes.',
    fullIdeaText: 'Startup Name: LagFree AI. Industry: Gaming. Problem: Cloud gaming users suffer input lag and packet loss during peak hours. Solution: Routing software using AI to optimize low-latency gaming traffic.'
  },
  {
    title: 'Intelligent AI NPC Generator for Game Developers',
    category: 'Gaming',
    type: 'AI Product',
    domains: ['Gaming', 'AI'],
    score: '98% Match',
    marketPotential: 'Explosive ($22B)',
    difficulty: 'Advanced',
    revenueModel: 'Unity/Unreal Plugin License ($49/mo)',
    timeToMVP: '3 Weeks',
    problem: 'Game studios spend millions writing static dialogue trees for non-player characters (NPCs) that repeat lines.',
    solution: 'LLM plugin for Unity and Unreal Engine giving NPCs unscripted conversational memory and dynamic voice responses.',
    fullIdeaText: 'Startup Name: DynamicNPC AI. Industry: Gaming. Problem: Game studios spend millions on repetitive static NPC dialogue trees. Solution: LLM plugin giving game NPCs unscripted memory and dynamic voice responses.'
  },
  {
    title: 'Esports Player Analytics & Aim Training Tracker',
    category: 'Gaming',
    type: 'SaaS',
    domains: ['Gaming'],
    score: '94% Match',
    marketPotential: 'High ($10B)',
    difficulty: 'Intermediate',
    revenueModel: 'Monthly Pro Subscription ($11.99/mo)',
    timeToMVP: '3 Weeks',
    problem: 'FPS gamers (Valorant, CS:GO) lack granular statistics on recoil control, crosshair placement, and reaction speed.',
    solution: 'Computer vision desktop app analyzing gameplay footage to score aim precision and suggest custom training drills.',
    fullIdeaText: 'Startup Name: AimTracker AI. Industry: Gaming. Problem: FPS gamers lack granular data on recoil control and reaction speed. Solution: Desktop app analyzing gameplay footage to score aim precision.'
  },
  {
    title: 'AI 3D Game Development & Texture Toolkit',
    category: 'Gaming',
    type: 'AI Product',
    domains: ['Gaming', 'AI'],
    score: '99% Match',
    marketPotential: 'Explosive ($30B)',
    difficulty: 'Advanced',
    revenueModel: 'Pro Creator Pass ($29 - $99/mo)',
    timeToMVP: '4 Weeks',
    problem: 'Indie game developers take months to manually model and texture 3D props and environment assets.',
    solution: 'Generative AI tool that converts text prompts or 2D sketches into 3D game-ready PBR textured models in seconds.',
    fullIdeaText: 'Startup Name: TextureAI 3D. Industry: Gaming. Problem: Indie game devs spend months modeling and texturing 3D game props. Solution: Generative AI tool converting text prompts into 3D game-ready PBR models.'
  },
  {
    title: 'Gamer Community & Squad Matchmaker Platform',
    category: 'Gaming',
    type: 'Mobile App',
    domains: ['Gaming'],
    score: '92% Match',
    marketPotential: 'Growing ($8B)',
    difficulty: 'Beginner',
    revenueModel: 'Freemium + VIP Badge ($4.99/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Solo gamers struggle to find non-toxic teammates with matching playstyles, schedules, and skill levels.',
    solution: 'Matchmaking app connecting solo gamers with compatible teammates based on gaming stats and behavioral ratings.',
    fullIdeaText: 'Startup Name: SquadFinder. Industry: Gaming. Problem: Solo gamers struggle to find non-toxic compatible teammates. Solution: Matchmaking app connecting gamers based on stats and non-toxic ratings.'
  },
  {
    title: 'Streamer AI Content Clipper & Overlay Assistant',
    category: 'Gaming',
    type: 'AI Product',
    domains: ['Gaming', 'AI'],
    score: '96% Match',
    marketPotential: 'High ($14B)',
    difficulty: 'Intermediate',
    revenueModel: 'Creator Monthly Subscription ($19/mo)',
    timeToMVP: '2 Weeks',
    problem: 'Twitch and YouTube gaming streamers spend 10+ hours a week sifting through live streams for viral clip moments.',
    solution: 'AI bot that monitors live stream chat reactions and gameplay audio spikes to auto-edit TikTok/YouTube Shorts clips.',
    fullIdeaText: 'Startup Name: ClipStream AI. Industry: Gaming. Problem: Streamers spend 10+ hours finding highlight moments in long streams. Solution: AI bot monitoring stream chat to auto-edit viral YouTube Shorts clips.'
  }
];

export default function InputPage() {
  const navigate = useNavigate();
  const { analyze, loading } = useApp();

  // Active Main View State: 'dashboard' | 'idea-form' | 'idea-helper' | 'category-explorer' | 'idea-details'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('ai-automation');
  const [selectedIdea, setSelectedIdea] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Artificial Intelligence');
  const [problem, setProblem] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [country, setCountry] = useState('United States');
  const [stage, setStage] = useState('Idea Stage');
  const [solution, setSolution] = useState('');

  // AI Idea Helper Wizard Reactive State
  const [selectedInterests, setSelectedInterests] = useState(['AI', 'Healthcare']);
  const [selectedSkills, setSelectedSkills] = useState(['Python', 'AI']);
  const [selectedType, setSelectedType] = useState('SaaS');
  const [reactiveIdeas, setReactiveIdeas] = useState([]);
  const [hasAnalyzedRequirements, setHasAnalyzedRequirements] = useState(false);
  const [isMatchingIdeas, setIsMatchingIdeas] = useState(false);

  // Analysis Loader State
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisDone, setAnalysisDone] = useState(false);

  // Reactive Idea Filtering Engine: Updates matching 5 to 10 ideas when selections change
  useEffect(() => {
    const filtered = masterIdeasCatalog.filter(idea => 
      idea.domains.some(d => selectedInterests.includes(d)) || 
      idea.category.toLowerCase() === selectedInterests[0]?.toLowerCase() ||
      idea.type === selectedType
    );
    // Guarantee 5 to 10 ideas
    setReactiveIdeas(filtered.length >= 5 ? filtered.slice(0, 10) : masterIdeasCatalog.slice(0, 8));
  }, [selectedInterests, selectedSkills, selectedType]);

  // Animate progress
  useEffect(() => {
    if (!showAnalysis) return;
    let interval;
    if (!analysisDone) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 2));
      }, 200);
    } else {
      setProgress(100);
      const timer = setTimeout(() => navigate('/dashboard'), 800);
      return () => clearTimeout(timer);
    }
    return () => clearInterval(interval);
  }, [showAnalysis, analysisDone, navigate]);

  // Handle Idea Submission
  const handleSubmitIdea = async (customIdeaText = null) => {
    setShowAnalysis(true);
    setProgress(0);
    setAnalysisDone(false);

    try {
      let fullDescription = '';
      if (customIdeaText) {
        fullDescription = customIdeaText;
      } else {
        fullDescription = `Startup Name: ${name || 'Startup Pilot Idea'}. Industry: ${industry}. Country: ${country}. Stage: ${stage}. Problem: ${problem || 'Lack of automated intelligence and manual workflow bottlenecks.'}. Solution: ${solution || 'AI-powered co-pilot providing real-time automation and decision analytics.'}. Target Users: ${targetUsers || 'Early-stage founders & business teams'}.`;
      }
      await analyze(fullDescription);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalysisDone(true);
    }
  };

  const interestsList = ['AI', 'Healthcare', 'Education', 'Finance', 'Cybersecurity', 'Agriculture', 'Real Estate', 'Gaming'];
  const skillsList = ['Python', 'Java', 'React', 'Flutter', 'Cloud', 'Marketing'];
  const typesList = ['SaaS', 'Mobile App', 'Marketplace', 'B2B', 'AI Product'];

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      if (list.length > 1) setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleOpenCategory = (catKey) => {
    setSelectedCategoryKey(catKey);
    setActiveTab('category-explorer');
  };

  const handleOpenIdeaDetails = (idea) => {
    setSelectedIdea(idea);
    setActiveTab('idea-details');
  };

  const currentCategory = categoryDataset[selectedCategoryKey] || categoryDataset['ai-automation'];

  // Loading Screen Render
  if (showAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#BAE6FD] via-[#E0F4FF] to-[#FDE8F3] text-slate-800 flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans select-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-400/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-md w-full text-center space-y-8 relative z-10 bg-white/75 backdrop-blur-2xl rounded-3xl p-8 border border-white/90 shadow-2xl">
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-pink-400/20 blur-xl animate-pulse" />
            <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-sky-400 via-purple-500 to-pink-500 animate-spin opacity-85" />
            <div className="absolute w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
              <Cpu className="w-8 h-8 text-pink-500 animate-pulse" />
              <span className="text-2xl font-black text-slate-800 mt-1">{progress}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">Analyzing Startup Concept...</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
              Generating market validation, competitor matrix, 5-year financials, and pitch deck.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BAE6FD] via-[#E0F4FF] to-[#FDE8F3] text-slate-800 flex flex-col justify-between relative overflow-x-hidden font-sans select-none p-6 md:p-10">
      {/* Background Animated Glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-pink-400/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-20 pb-6 border-b border-[#0EA5E9]/10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/ideaexecutor_icon.png" alt="IdeaExecutor Logo" className="w-10 h-10 object-contain drop-shadow-md" />
          <div>
            <span className="font-black text-slate-800 text-lg tracking-tight block">IdeaExecutor</span>
            <span className="text-[9px] text-[#0EA5E9] font-bold tracking-widest -mt-1 block uppercase">Turn Ideas into Reality with AI</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'dashboard' ? 'bg-[#F43F8A] text-white' : 'text-slate-600 hover:text-slate-800 bg-[#0EA5E9]/5 hover:bg-[#0EA5E9]/10'}`}
          >
            Welcome Dashboard
          </button>
          <button
            onClick={() => setActiveTab('idea-form')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'idea-form' ? 'bg-[#F43F8A] text-white' : 'text-slate-600 hover:text-slate-800 bg-[#0EA5E9]/5 hover:bg-[#0EA5E9]/10'}`}
          >
            I Have an Idea
          </button>
          <button
            onClick={() => { setActiveTab('idea-helper'); setHasAnalyzedRequirements(false); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'idea-helper' ? 'bg-gradient-to-r from-[#0EA5E9] to-[#F43F8A] text-white' : 'text-slate-600 hover:text-slate-800 bg-[#0EA5E9]/5 hover:bg-[#0EA5E9]/10'}`}
          >
            ✨ AI Idea Helper
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto my-8 relative z-10 space-y-10">

        {/* ─── VIEW 1: WELCOME DASHBOARD ─── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Hero Banner */}
            <div className="bg-white/75 backdrop-blur-2xl rounded-3xl p-8 border border-white/90 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-left">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F43F8A]/10 border border-[#F43F8A]/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#F43F8A]">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                  <span>Welcome Back, Founder 👋</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                  Let's build your next successful startup.
                </h1>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Choose whether you already have an idea to validate or use our AI Idea Helper below to generate 5-10 tailored startup ideas.
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab('idea-form')}
                    className="px-6 py-3.5 bg-gradient-to-r from-[#F43F8A] via-[#8B5CF6] to-[#0EA5E9] text-white text-xs font-black rounded-2xl shadow-lg shadow-pink-500/20 hover:scale-105 transition cursor-pointer flex items-center gap-2"
                  >
                    <Rocket className="w-4 h-4 text-yellow-300" />
                    <span>I Have an Idea</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('idea-helper'); setHasAnalyzedRequirements(false); }}
                    className="px-6 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-black rounded-2xl shadow-sm transition cursor-pointer flex items-center gap-2"
                  >
                    <Lightbulb className="w-4 h-4 text-[#0EA5E9]" />
                    <span>Help Me Find an Idea</span>
                  </button>
                </div>
              </div>

              {/* IdeaExecutor Illustration */}
              <div className="w-52 h-52 rounded-3xl bg-gradient-to-tr from-[#BAE6FD] via-[#E0F4FF] to-[#FDE8F3] border border-white/60 shadow-2xl flex flex-col items-center justify-center p-4 relative text-center">
                <img src="/ideaexecutor_icon.png" alt="IdeaExecutor Logo" className="w-20 h-20 object-contain drop-shadow-lg animate-bounce" />
                <h3 className="text-sm font-black tracking-tight text-slate-800 mt-3">IDEAEXECUTOR</h3>
                <span className="text-[8px] font-bold text-[#0EA5E9] uppercase tracking-widest">TURN IDEAS INTO REALITY WITH AI</span>
              </div>
            </div>

            {/* Curated Startup Categories Grid */}
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-[#0EA5E9]/10 pb-3">
                <div>
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-[#0EA5E9]" />
                    <span>Curated Startup Idea Categories</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Click "Explore Category" to view dedicated market sizing, tech stacks, and startup blueprints.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { key: 'ai-automation', icon: '🤖', title: 'AI & Automation Services', ideas: ['AI Customer Support Platform', 'AI Resume Builder', 'AI Content Studio'] },
                  { key: 'healthtech', icon: '🏥', title: 'HealthTech Platforms', ideas: ['AI Telemedicine Platform', 'Mental Health Companion', 'AI Hospital Management'] },
                  { key: 'b2b-saas', icon: '☁️', title: 'B2B SaaS Solutions', ideas: ['CRM for Small Businesses', 'HR Management System', 'Subscription Billing'] },
                  { key: 'cybersecurity', icon: '🔒', title: 'Data & Cybersecurity', ideas: ['Vulnerability Scanner', 'AI Fraud Detection Engine', 'Compliance Monitor'] },
                ].map((cat, idx) => (
                  <div key={idx} className="bg-[#0E132B]/85 rounded-3xl p-6 border border-purple-500/20 space-y-4 flex flex-col justify-between hover:border-purple-500/50 shadow-xl transition">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h3 className="text-sm font-black text-white">{cat.icon} {cat.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {cat.ideas.map((item, i) => (
                          <li key={i} className="text-xs text-slate-300 font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleOpenCategory(cat.key)}
                      className="w-full py-3 bg-gradient-to-r from-[#6D28FF] to-[#EC4899] hover:opacity-95 text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                      <span>Explore Category</span>
                      <ArrowRight className="w-4 h-4 text-yellow-300" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── VIEW 2: DEDICATED CATEGORY EXPLORER ─── */}
        {activeTab === 'category-explorer' && (
          <div className="space-y-8 text-left">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4 text-[#6D28FF]" />
              <span>← Back to Categories</span>
            </button>

            <div className={`bg-gradient-to-r ${currentCategory.gradient} rounded-3xl p-8 md:p-10 text-white space-y-4 shadow-2xl relative overflow-hidden`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{currentCategory.badge}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{currentCategory.title}</h1>
              <p className="text-purple-100 text-sm font-medium max-w-2xl leading-relaxed">{currentCategory.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">TAM (Market Size)</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{currentCategory.market.tam}</span>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Annual Growth</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">{currentCategory.market.growth}</span>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Competition</span>
                <span className="text-2xl font-black text-indigo-600 mt-1 block">{currentCategory.market.competition}</span>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">VC Funding Sentiment</span>
                <span className="text-2xl font-black text-purple-600 mt-1 block">{currentCategory.market.funding}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#F43F8A]" />
                <span>🔥 Trending {currentCategory.title} Ideas</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentCategory.ideas.map((idea, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 border border-purple-100 shadow-lg space-y-4 flex flex-col justify-between hover:border-[#6D28FF]/40 transition">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-extrabold px-2.5 py-1 bg-purple-100 text-[#6D28FF] rounded-full uppercase">{idea.tag}</span>
                        <span className="text-xs font-black text-amber-500">{idea.rating}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">{idea.title}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{idea.problem}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleOpenIdeaDetails(idea)}
                        className="flex-1 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#6D28FF] font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>View Blueprint</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSubmitIdea(idea.fullIdeaText)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#6D28FF] to-[#EC4899] text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Analyze with AI</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── VIEW 3: STARTUP IDEA DETAILS BLUEPRINT ─── */}
        {activeTab === 'idea-details' && selectedIdea && (
          <div className="space-y-8 text-left max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab('category-explorer')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4 text-[#6D28FF]" />
              <span>← Back to {currentCategory.title}</span>
            </button>

            <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-purple-100 text-[#6D28FF] text-xs font-extrabold rounded-full uppercase">{selectedIdea.tag}</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs font-extrabold rounded-full uppercase">{selectedIdea.subTag}</span>
                <span className="text-xs font-black text-amber-500 ml-auto">{selectedIdea.rating}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900">{selectedIdea.title}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-6 space-y-2 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Problem Statement</span>
                </h3>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{selectedIdea.problem}</p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 space-y-2 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Proposed AI Solution</span>
                </h3>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{selectedIdea.solution}</p>
              </div>
            </div>

            <button
              onClick={() => handleSubmitIdea(selectedIdea.fullIdeaText)}
              className="w-full py-4 bg-gradient-to-r from-[#6D28FF] via-[#A855F7] to-[#EC4899] text-white font-black text-sm rounded-2xl shadow-xl shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span>Analyze with IdeaExecutor AI Engine</span>
            </button>
          </div>
        )}

        {/* ─── VIEW 4: REACTIVE AI IDEA HELPER ("Don't know what to build?") ─── */}
        {activeTab === 'idea-helper' && (
          <div className="max-w-4xl mx-auto space-y-8 text-left">
            <div className="bg-white/75 backdrop-blur-2xl rounded-3xl p-8 border border-white/90 shadow-2xl space-y-8">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#0EA5E9]">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                  <span>💡 Dynamic 5-10 AI Startup Generator</span>
                </div>
                <h2 className="text-3xl font-black text-slate-800">Don't know what to build?</h2>
                <p className="text-xs text-slate-500 font-semibold max-w-xl mx-auto text-center">
                  Select your target domain, skills, and business model below. Click "Analyze Requirements" to generate 5 to 10 tailored AI startup ideas.
                </p>
              </div>

              {/* Requirement Step 1: Target Domain */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#F43F8A]">1. Target Domain / Industry</h3>
                  <span className="text-[10px] font-bold text-slate-400">Select one or more</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {interestsList.map((item) => {
                    const active = selectedInterests.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleSelection(item, selectedInterests, setSelectedInterests)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? 'bg-[#F43F8A] text-white border-pink-400 shadow-md scale-[1.03]'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-pink-400/50'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5 text-white" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Requirement Step 2: Key Skills */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0EA5E9]">2. Core Technology / Skills</h3>
                  <span className="text-[10px] font-bold text-slate-400">Select one or more</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {skillsList.map((item) => {
                    const active = selectedSkills.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleSelection(item, selectedSkills, setSelectedSkills)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? 'bg-[#0EA5E9] text-white border-sky-400 shadow-md scale-[1.03]'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-sky-400/50'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5 text-white" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Requirement Step 3: Preferred Business Model */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-600">3. Preferred Business Model</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {typesList.map((item) => {
                    const active = selectedType === item;
                    return (
                      <button
                        key={item}
                        onClick={() => setSelectedType(item)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                          active
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md scale-[1.03]'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-purple-400/50'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Analyser / Generator Button directly below requirement selection */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsMatchingIdeas(true);
                  setTimeout(() => {
                    setIsMatchingIdeas(false);
                    setHasAnalyzedRequirements(true);
                  }, 650);
                }}
                className="w-full py-4 bg-gradient-to-r from-[#F43F8A] via-[#8B5CF6] to-[#0EA5E9] text-white text-xs font-black rounded-2xl shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2.5 cursor-pointer hover:opacity-95 transition mt-6"
              >
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span>Analyze Requirements & Generate 5–10 AI Startup Ideas</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.button>
            </div>

            {/* AI LOADING SPINNER CARD */}
            {isMatchingIdeas && (
              <div className="bg-white rounded-3xl p-8 border border-purple-200 shadow-xl text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0EA5E9] via-[#8B5CF6] to-[#F43F8A] flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20 animate-spin">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Analyzing Selected Requirements...</h3>
                <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto">
                  Scanning 80+ startup blueprints across <span className="text-[#F43F8A] font-bold">{selectedInterests.join(', ')}</span> & <span className="text-[#0EA5E9] font-bold">{selectedType}</span>.
                </p>
              </div>
            )}

            {/* LIVE RESULTS SECTION: Only shown AFTER user clicks Analyze Requirements */}
            {hasAnalyzedRequirements && !isMatchingIdeas && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#0EA5E9]/15 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500 animate-spin" />
                      <span>🎯 Top {reactiveIdeas.length} Recommended AI Startup Ideas</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Tailored to <span className="text-[#F43F8A] font-bold">{selectedInterests.join(', ')}</span> • <span className="text-[#0EA5E9] font-bold">{selectedSkills.join(', ')}</span> • <span className="text-purple-600 font-bold">{selectedType}</span>
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-[#6D28FF] text-xs font-extrabold rounded-full">
                    {reactiveIdeas.length} High-Yield Matches
                  </span>
                </div>

                {/* Grid of Dynamically Generated Idea Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reactiveIdeas.map((idea, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="bg-white rounded-3xl p-6 border border-purple-500/20 space-y-4 flex flex-col justify-between shadow-xl hover:border-purple-500/50 transition"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black px-2.5 py-1 bg-purple-100 text-[#6D28FF] rounded-full uppercase">
                            {idea.category} • {idea.type}
                          </span>
                          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                            ⭐ {idea.score}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 leading-snug">{idea.title}</h4>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{idea.problem}</p>

                        <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs text-purple-900 font-semibold leading-relaxed">
                          <span className="font-extrabold text-[#6D28FF] block mb-0.5">AI Solution & Value Proposition:</span>
                          {idea.solution}
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 pt-2 text-[11px] font-bold text-slate-600 border-t border-slate-100">
                          <div>Market Potential: <span className="text-[#0EA5E9] font-extrabold">{idea.marketPotential}</span></div>
                          <div>Difficulty: <span className="text-purple-600 font-extrabold">{idea.difficulty}</span></div>
                          <div>Revenue Model: <span className="text-emerald-600 font-extrabold">{idea.revenueModel}</span></div>
                          <div>Est. MVP Time: <span className="text-[#F43F8A] font-extrabold">{idea.timeToMVP}</span></div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSubmitIdea(idea.fullIdeaText)}
                        className="w-full py-3.5 bg-gradient-to-r from-[#F43F8A] via-[#8B5CF6] to-[#0EA5E9] text-white text-xs font-black rounded-2xl shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                        <span>Generate Complete Business Plan & Analyze</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── VIEW 5: STANDARD IDEA FORM ─── */}
        {activeTab === 'idea-form' && (
          <div className="max-w-2xl mx-auto space-y-6 text-left">
            <div className="bg-white/75 backdrop-blur-2xl rounded-3xl p-8 border border-white/90 shadow-2xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-800">Startup Idea Submission</h2>
                <p className="text-xs text-slate-500 font-semibold">Enter your concept details to run complete AI market validation & pitch deck generator.</p>
              </div>

              <div className="space-y-4 text-xs font-bold text-slate-700">
                <div>
                  <label className="block mb-1.5 uppercase text-[10px] tracking-wider text-slate-500">Startup Name</label>
                  <input
                    type="text"
                    placeholder="e.g. EduAI Assistant"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#E0F4FF]/30 border border-[#0EA5E9]/15 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F43F8A] focus:ring-2 focus:ring-[#F43F8A]/10 transition"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 uppercase text-[10px] tracking-wider text-slate-500">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-[#E0F4FF]/30 border border-[#0EA5E9]/15 rounded-2xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#F43F8A] transition"
                  >
                    {['Artificial Intelligence', 'Healthcare', 'Education', 'Finance', 'Cybersecurity', 'B2B SaaS', 'E-Commerce', 'Gaming'].map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 uppercase text-[10px] tracking-wider text-slate-500">Problem Statement</label>
                  <textarea
                    rows={3}
                    placeholder="What major problem does your startup solve?"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full bg-[#E0F4FF]/30 border border-[#0EA5E9]/15 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F43F8A] focus:ring-2 focus:ring-[#F43F8A]/10 transition"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 uppercase text-[10px] tracking-wider text-slate-500">Proposed Solution</label>
                  <textarea
                    rows={3}
                    placeholder="How does your product solve this problem using AI?"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full bg-[#E0F4FF]/30 border border-[#0EA5E9]/15 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F43F8A] focus:ring-2 focus:ring-[#F43F8A]/10 transition"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubmitIdea()}
                className="w-full py-4 bg-gradient-to-r from-[#F43F8A] via-[#8B5CF6] to-[#0EA5E9] text-white text-xs font-black rounded-2xl shadow-xl shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                <span>Analyze with AI</span>
              </motion.button>
            </div>
          </div>
        )}
      </main>

      {/* Voice Narration */}
      <VoicePlayerBar
        title="Startup Pilot Guidance"
        textToRead="Welcome to Startup Pilot! Select your target domain, skills, and business model to generate 5 to 10 tailored AI startup ideas."
      />
    </div>
  );
}