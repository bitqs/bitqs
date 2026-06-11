const i18n = {
  zh: {
    tagline: '独立开发者 · AI × 游戏',
    worksTitle: '最近的 AI 作品',
    play: '▶ 试玩',
    demo: '▶ 示例',
    wechat: '公众号:爱通缩',
    sgsDesc: '三国题材《吸血鬼幸存者》式割草。8 名将、无双绝技、千军万马一念清场。浏览器直开无需下载:升级构筑(三选一/进化/天命)、多名战与 Boss、局外成长、横竖屏自适应。',
    slotDesc: '1950s 木质黄铜拟物老虎机,纯前端:真实符号带概率模型(RTP 94%/软保底/near-miss 工程化)、有物理手感的拉杆(阻力曲线+咬合点+阻尼回摆)、ElevenLabs 爵士 BGM 与机械音效,777 头奖爆出生成艺术海报。',
    tgtDesc: '一系列「探究游戏为何好玩」的极简元游戏,把玩法拆到最小的上瘾内核。№2「游戏的诞生」:浏览器可玩卡牌游戏,逐层拆解反馈、随机、稀有度、成长、juice,多结局。',
    artDesc: '美术馆潜入偷画 push-your-luck roguelite。接入 4 家真实博物馆开放 API(The Met、V&A、芝加哥艺术学院、克利夫兰),风险/回报抉择,赌画作真伪,装备升级。',
    survDesc: 'Godot 4 类幸存者游戏,「人生即游戏」主题:寿命=时间,敌人=生活压力,升级=人生选择,11 种祝福/诅咒。',
    threeDesc: 'Godot 4 三国主题割草动作游戏。组件化架构:伤害管线、信号总线、能力系统、局外成长。',
    sharpDesc: 'Claude Code 技能:把乔布斯式产品直觉与马斯克式第一性原理,合成一套判断力框架,零废话输出。',
    maiaDesc: '把任意知识体系转成可交互的双语教学图谱,按逻辑顺序边看边学——已有道德经、金刚经等线上示例。',
  },
  en: {
    tagline: 'Indie developer · AI × Games',
    worksTitle: 'Recent AI Works',
    play: '▶ Play',
    demo: '▶ Demo',
    wechat: 'WeChat: 爱通缩',
    sgsDesc: 'A Vampire-Survivors-style horde game set in the Three Kingdoms. 8 generals, Musou ultimates, clear the field with one move. Runs in-browser, no download: roguelite build (pick-3 / evolution / arcana), named battles & bosses, meta progression, landscape/portrait adaptive.',
    slotDesc: 'A 1950s wood-and-brass skeuomorphic slot machine, pure frontend: real weighted-strip odds (94% RTP, soft pity, engineered near-miss), a lever with physical feel (resistance curve, commit detent, damped spring-back), ElevenLabs jazz BGM & mechanical SFX. Hit 777 for a generative-art jackpot poster.',
    tgtDesc: 'A series of minimal meta-games exploring why games are fun, stripping play down to its addictive core. №2 "The Birth of Games": a browser-playable card game dissecting feedback, randomness, rarity, progression and juice layer by layer — multiple endings.',
    artDesc: 'Push-your-luck roguelite art heist. Steal paintings from 4 real museums via their open APIs (The Met, V&A, Art Institute of Chicago, Cleveland). Risk/reward choices, gamble on authenticity, equipment upgrades.',
    survDesc: 'Godot 4 survivor-like with a "life as a game" theme: lifespan = time, enemies = life stress, level-ups = life choices, 11 blessings/curses.',
    threeDesc: 'Godot 4 Three-Kingdoms-themed horde survival action game. Component architecture: damage pipeline, signal bus, ability system, meta progression.',
    sharpDesc: "Claude Code skill: fuses Jobs-style product intuition with Musk-style first-principles reasoning into one judgment framework. Zero-filler output.",
    maiaDesc: 'Turns any body of knowledge into an interactive bilingual teaching graph — learn concepts in logical order. Live examples: Tao Te Ching, Diamond Sutra.',
  },
};

const titles = { zh: 'QS · AI 作品集', en: 'QS · AI Works' };

function setLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (i18n[lang][key]) el.textContent = i18n[lang][key];
  });
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = titles[lang];
  document.getElementById('lang-toggle').textContent = lang === 'zh' ? 'EN' : '中';
  localStorage.setItem('lang', lang);
}

let lang = localStorage.getItem('lang') || 'zh';
setLang(lang);

document.getElementById('lang-toggle').addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh';
  setLang(lang);
});
