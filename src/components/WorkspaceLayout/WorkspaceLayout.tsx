import type { WorkspaceHome } from '@/shared/types/routes.types'
import type { ReactNode } from 'react'

import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import { ROLE_LABELS } from '@/shared/constants/task.const'
import styles from '@/shared/styles/workspace.module.css'
import { Alert, AlertDescription, Button } from '@/shared/ui'
import {
  Building03Icon,
  Logout01Icon,
  SidebarLeft01Icon,
  Task01Icon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'

import { useWorkspaceLayout } from './useWorkspaceLayout'

interface WorkspaceLayoutProps {
  home: WorkspaceHome
  children: ReactNode
  fullWidth?: boolean
}
const WorkspaceLayout = ({ home, children, fullWidth }: WorkspaceLayoutProps) => {
  const { states, functions } = useWorkspaceLayout(home)
  const navigation = (
    <nav className={styles.navigation} aria-label="Основная навигация">
      <Link
        to={home}
        activeOptions={{ exact: true }}
        aria-current={!states.isTasks ? 'page' : undefined}
        aria-label="Объекты"
      >
        <HugeiconsIcon icon={Building03Icon} size={18} aria-hidden="true" />
        <span className={styles.sidebarLabel}>
          <span className={styles.navLabel}>Объекты</span>
        </span>
      </Link>
      <Link
        to={states.tasksPath}
        search={states.tasksSearch}
        aria-current={states.isTasks ? 'page' : undefined}
        aria-label={states.user?.role === 'manager' ? 'Все задачи' : 'Мои задачи'}
      >
        <HugeiconsIcon icon={Task01Icon} size={18} aria-hidden="true" />
        <span className={styles.sidebarLabel}>
          <span className={styles.navLabel}>
            {states.user?.role === 'manager' ? 'Все задачи' : 'Мои задачи'}
          </span>
        </span>
      </Link>
    </nav>
  )
  return (
    <div className={styles.app}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={() => document.getElementById('main-content')?.focus()}
      >
        Перейти к содержимому
      </a>
      <header className={styles.mobileHeader}>{navigation}</header>
      <div className={styles.sidebarRegion}>
        <aside className={styles.sidebar}>
          <Link className={styles.logo} to={home} aria-label="Объекты / Задачи — главная">
            <HugeiconsIcon icon={SidebarLeft01Icon} size={22} aria-hidden="true" />
            <span className={styles.sidebarLabel}>
              <span className={styles.logoText}>
                ОБЪЕКТЫ<span>/ ЗАДАЧИ</span>
              </span>
            </span>
          </Link>
          {navigation}
          <div className={styles.user}>
            <div className={styles.sidebarLabel}>
              <div className={styles.userInfo}>
                <strong>{states.user?.name}</strong>
                <span>{states.user && ROLE_LABELS[states.user.role]}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="lg"
              className={styles.signOut}
              aria-label="Выйти из аккаунта"
              title="Выйти из аккаунта"
              disabled={states.busy}
              onClick={functions.onSignOut}
            >
              <HugeiconsIcon icon={Logout01Icon} aria-hidden="true" />
              <span className={styles.sidebarLabel}>
                <span className={styles.navLabel}>Выйти</span>
              </span>
            </Button>
          </div>
        </aside>
      </div>
      <main className={styles.main} id="main-content" tabIndex={-1}>
        <header className={styles.topbar}>
          <div className={styles.workspaceName}>
            <span>Мини-CRM строительной компании</span>
            <strong>{states.isTasks ? 'Управление задачами' : 'Управление объектами'}</strong>
          </div>
          <div className="actions">
            <Button variant="outline" size="sm" onClick={functions.onRefresh}>
              Обновить
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <div className={styles.content} data-full-width={fullWidth || undefined}>
          {states.error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{states.error}</AlertDescription>
            </Alert>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
export default WorkspaceLayout
