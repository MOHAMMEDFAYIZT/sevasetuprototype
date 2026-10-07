export type Language = 'en' | 'hi';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.my_jobs': 'My Jobs',
    'nav.saved': 'Saved',
    'nav.profile': 'Profile',

    // Home
    'home.greeting': 'Good day',
    'home.hero_title': 'What service do you need today?',
    'home.search_placeholder': 'Search electrician, plumber, painter...',
    'home.most_searched': 'Most Searched Services',
    'home.other_services': 'Other Rural & Daily Services',
    'home.verified_tag': 'Verified within 20 km',
    'home.active_order_title': 'Active Request',
    'home.view_details': 'View Details',
    'home.call_worker': 'Call Worker',
    'home.waiting_reply': 'Waiting for worker reply',
    'home.worker_hired': 'Worker Hired & Confirmed',

    // Categories
    'cat.electrician': 'Electrician',
    'cat.plumber': 'Plumber',
    'cat.carpenter': 'Carpenter',
    'cat.painter': 'Painter',
    'cat.cleaning': 'House Cleaning',
    'cat.gardening': 'Gardening',
    'cat.farm_work': 'Farm Work',
    'cat.mechanic': 'Motor Mechanic',
    'cat.cooking': 'Cook / Catering',
    'cat.transport': 'Transport / Driver',
    'cat.animal_care': 'Animal & Livestock Care',
    'cat.general_labour': 'General Labour',
    'cat.tailor': 'Tailor',
    'cat.mason': 'Mason / Bricklayer',
    'cat.tile_worker': 'Tile Worker',
    'cat.appliance_repair': 'Appliance Repair',
    'cat.welder': 'Welder',
    'cat.tree_cutter': 'Tree Cutter',
    'cat.well_digger': 'Well Digger',
    'cat.cattle_care': 'Cattle & Dairy Care',
    'cat.pest_control': 'Pest Control',

    // Workers List
    'workers.title': 'Workers Near You',
    'workers.subtitle': 'Choose workers you need • All accepted will be hired',
    'workers.view_profile': 'View Profile',
    'workers.km_away': 'km away',
    'workers.selected': 'selected',
    'workers.send_request': 'Send Request',
    'workers.request_more': 'Hire Additional Workers',

    // Worker Profile Modal
    'profile_modal.details': 'Worker Details',
    'profile_modal.standard_rate': 'Standard daily wage',
    'profile_modal.skills': 'Skills & Specialties',
    'profile_modal.about': 'About Worker',
    'profile_modal.select_button': 'Select Worker for Job',
    'profile_modal.selected_button': 'Selected for Job • Tap to Remove',

    // Job Details Modal
    'job_modal.title': 'Specify Requirement',
    'job_modal.service_date': 'Service Date',
    'job_modal.today': 'Today',
    'job_modal.location': 'Service Location',
    'job_modal.change': 'Change',
    'job_modal.notes': 'Job details',
    'job_modal.notes_placeholder': 'Tell us what needs to be done...',
    'job_modal.find_workers': 'Find Workers',

    // My Jobs
    'jobs.title': 'My Jobs',
    'jobs.matched': 'Matched',
    'jobs.pending': 'Pending',
    'jobs.past_history': 'Past History',
    'jobs.mark_completed': 'Mark as completed',
    'jobs.cancel_request': 'Cancel request',

    // Profile Page
    'profile.title': 'My Account',
    'profile.past_jobs': 'Past Job History',
    'profile.past_jobs_sub': 'View all completed and past requests',
    'profile.help': 'Help & Support',
    'profile.help_sub': 'Toll-free customer care & WhatsApp support',
    'profile.faq': 'Frequently Asked Questions',
    'profile.faq_sub': 'Answers to common questions',
    'profile.terms': 'Terms & Conditions',
    'profile.terms_sub': 'Privacy policy and user guidelines',
    'profile.logout': 'Log Out',

    // Notifications
    'notif.title': 'Notifications',
    'notif.empty': 'No new notifications',
    'notif.mark_read': 'Mark all as read',

    // Language modal
    'lang.title': 'Select Language / भाषा चुनें',
    'lang.en': 'English',
    'lang.hi': 'हिन्दी (Hindi)'
  },
  hi: {
    // Nav
    'nav.home': 'होम',
    'nav.my_jobs': 'मेरे काम',
    'nav.saved': 'पसंदीदा',
    'nav.profile': 'प्रोफ़ाइल',

    // Home
    'home.greeting': 'नमस्ते',
    'home.hero_title': 'आज आपको किस सेवा की आवश्यकता है?',
    'home.search_placeholder': 'इलेक्ट्रीशियन, प्लंबर, पेंटर खोजें...',
    'home.most_searched': 'सबसे ज़्यादा खोजी गई सेवाएँ',
    'home.other_services': 'अन्य ग्रामीण व दैनिक सेवाएँ',
    'home.verified_tag': '20 किमी के दायरे में सत्यापित',
    'home.active_order_title': 'सक्रिय अनुरोध',
    'home.view_details': 'विवरण देखें',
    'home.call_worker': 'कॉल करें',
    'home.waiting_reply': 'कारीगर के जवाब का इंतज़ार है',
    'home.worker_hired': 'कारीगर तय हो चुका है',

    // Categories
    'cat.electrician': 'इलेक्ट्रीशियन (बिजली मिस्त्री)',
    'cat.plumber': 'प्लंबर (नल मिस्त्री)',
    'cat.carpenter': 'बढ़ई (लकड़ी का काम)',
    'cat.painter': 'पेंटर (रंगाई)',
    'cat.cleaning': 'घर की सफ़ाई',
    'cat.gardening': 'बागवानी',
    'cat.farm_work': 'खेती का काम',
    'cat.mechanic': 'मोटर मैकेनिक',
    'cat.cooking': 'रसोइया / खाना बनाना',
    'cat.transport': 'ड्राइवर / परिवहन',
    'cat.animal_care': 'पशु देखभाल',
    'cat.general_labour': 'मजदूर / सहायक',
    'cat.tailor': 'दर्जी (सिलाई)',
    'cat.mason': 'राजमिस्त्री (चिनाई)',
    'cat.tile_worker': 'टाइल मिस्त्री',
    'cat.appliance_repair': 'उपकरण मरम्मत',
    'cat.welder': 'वेल्डर (लोहे का काम)',
    'cat.tree_cutter': 'पेड़ कटाई',
    'cat.well_digger': 'कुआं खुदाई',
    'cat.cattle_care': 'पशुपालन व डेयरी',
    'cat.pest_control': 'कीट नियंत्रण',

    // Workers List
    'workers.title': 'आपके नज़दीकी कारीगर',
    'workers.subtitle': 'कारीगर चुनें • जो स्वीकार करेंगे, वे काम पर आएंगे',
    'workers.view_profile': 'प्रोफ़ाइल देखें',
    'workers.km_away': 'किमी दूर',
    'workers.selected': 'चुने गए',
    'workers.send_request': 'अनुरोध भेजें',
    'workers.request_more': 'और कारीगर जोड़ें',

    // Worker Profile Modal
    'profile_modal.details': 'कारीगर का विवरण',
    'profile_modal.standard_rate': 'मानक दैनिक मजदूरी',
    'profile_modal.skills': 'हुनर व विशेषज्ञता',
    'profile_modal.about': 'कारीगर के बारे में',
    'profile_modal.select_button': 'इस कारीगर को काम के लिए चुनें',
    'profile_modal.selected_button': 'कारीगर चुना गया • हटाने के लिए टैप करें',

    // Job Details Modal
    'job_modal.title': 'काम की जानकारी भरें',
    'job_modal.service_date': 'काम की तारीख',
    'job_modal.today': 'आज',
    'job_modal.location': 'काम का पता',
    'job_modal.change': 'बदलें',
    'job_modal.notes': 'काम का विवरण',
    'job_modal.notes_placeholder': 'बताएं कि क्या काम करवाना है...',
    'job_modal.find_workers': 'कारीगर खोजें',

    // My Jobs
    'jobs.title': 'मेरे काम',
    'jobs.matched': 'स्वीकृत',
    'jobs.pending': 'प्रतीक्षारत',
    'jobs.past_history': 'पुराने काम',
    'jobs.mark_completed': 'काम पूरा हुआ चिह्नित करें',
    'jobs.cancel_request': 'अनुरोध रद्द करें',

    // Profile Page
    'profile.title': 'मेरा खाता',
    'profile.past_jobs': 'पुराने काम का इतिहास',
    'profile.past_jobs_sub': 'पूरे हुए और रद्द किए गए काम देखें',
    'profile.help': 'सहायता और संपर्क',
    'profile.help_sub': 'टोल-फ्री हेल्पलाइन और व्हाट्सएप सहायता',
    'profile.faq': 'अक्सर पूछे जाने वाले सवाल',
    'profile.faq_sub': 'ज़रूरी सवालों के जवाब',
    'profile.terms': 'नियम और शर्तें',
    'profile.terms_sub': 'गोपनीयता नीति और सेवा शर्तें',
    'profile.logout': 'लॉग आउट',

    // Notifications
    'notif.title': 'सूचनाएं',
    'notif.empty': 'कोई नई सूचना नहीं है',
    'notif.mark_read': 'सभी पढ़ी हुई चिह्नित करें',

    // Language modal
    'lang.title': 'भाषा चुनें / Select Language',
    'lang.en': 'English',
    'lang.hi': 'हिन्दी (Hindi)'
  }
};
