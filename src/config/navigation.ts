import {
	Rocket,
	BookOpen,
	Map,
	Building2,
	Dna,
	Sparkles,
	type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'guide' -> t('nav.guide')
	path: string // URL 路径，如 '/guide'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：ARK Genesis Ascended Part 1 的 6 个内容分类
// 顺序遵循玩家探索流程：发布信息 → 攻略 → 地图 → 建家 → 生物 → 新功能
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'release', path: '/release', icon: Rocket, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'map', path: '/map', icon: Map, isContentType: true },
	{ key: 'bases', path: '/bases', icon: Building2, isContentType: true },
	{ key: 'creatures', path: '/creatures', icon: Dna, isContentType: true },
	{ key: 'features', path: '/features', icon: Sparkles, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/'

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
