import type { ReactNode } from 'react'
import styles from './NavBar.module.css'

export type NavItem = {
  key: string
  label: string
  icon?: ReactNode
}

type NavBarProps = {
  title?: string
  logo?: ReactNode
  items: NavItem[]
  activeKey?: string
  onSelect?: (key: string) => void
  footer?: ReactNode
}

export function NavBar({
  title = 'Luxora',
  logo,
  items,
  activeKey,
  onSelect,
  footer,
}: NavBarProps) {
  return (
    <aside className={styles.nav}>
      <div className={styles.brand}>
        <div className={styles.brandLogo}>{logo ?? 'L'}</div>
        <div className={styles.brandTitle}>{title}</div>
      </div>
      <nav className={styles.menu}>
        {items.map((item) => {
          const isActive = item.key === activeKey
          return (
            <div
              key={item.key}
              className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
              onClick={() => onSelect?.(item.key)}
              role="button"
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={styles.icon}>{item.icon}</div>
              <div className={styles.label}>{item.label}</div>
            </div>
          )
        })}
      </nav>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </aside>
  )
}

export default NavBar