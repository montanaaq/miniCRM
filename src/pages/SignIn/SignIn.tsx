import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import { ROUTES } from '@/shared/constants/routes.const'
import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  Spinner
} from '@/shared/ui'
import { ViewIcon, ViewOffSlashIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'

import styles from './SignIn.module.css'
import { useSignIn } from './useSignIn'

const SignIn = () => {
  const { states, functions } = useSignIn()
  return (
    <main className={styles.layout}>
      <title>Вход · мини-CRM</title>
      <section className={styles.intro}>
        <Link className={styles.logo} to={ROUTES.ROOT}>
          ОБЪЕКТЫ / ЗАДАЧИ
        </Link>
        <div>
          <h1>
            Работа на объекте
            <br />
            Под контролем
          </h1>
          <p>Ставьте задачи, следите за выполнением и принимайте результат в одном месте.</p>
        </div>
        <div></div>
      </section>
      <section className={styles.login} aria-labelledby="sign-in-title">
        <div className={styles.loginHeading}>
          <h2 id="sign-in-title">Вход в систему</h2>
          <ThemeToggle />
        </div>
        <p>Используйте учётную запись, которую выдал руководитель.</p>
        <form
          method="post"
          onSubmit={event => {
            event.preventDefault()
            void functions.onSubmit(event.currentTarget)
          }}
          aria-busy={states.busy}
        >
          <FieldGroup>
            <Field data-disabled={states.busy}>
              <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
              <Input
                id="sign-in-email"
                name="email"
                type="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                disabled={states.busy}
              />
            </Field>
            <Field data-disabled={states.busy}>
              <FieldLabel htmlFor="sign-in-password">Пароль</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="sign-in-password"
                  name="password"
                  type={states.passwordType}
                  autoComplete="current-password"
                  spellCheck={false}
                  required
                  disabled={states.busy}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-sm"
                    aria-label="Показать пароль"
                    aria-pressed={states.passwordVisible}
                    aria-controls="sign-in-password"
                    disabled={states.busy}
                    onClick={() => functions.onTogglePassword()}
                  >
                    <HugeiconsIcon
                      icon={states.passwordVisible ? ViewOffSlashIcon : ViewIcon}
                      size={24}
                      aria-hidden="true"
                    />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            {states.error && (
              <Alert variant="destructive">
                <AlertDescription>{states.error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={states.busy}>
              {states.busy && <Spinner data-icon="inline-start" aria-label="Выполняется вход" />}
              Войти
            </Button>
          </FieldGroup>
        </form>
        <p className={styles.note}>Регистрация закрыта. За доступом обратитесь к администратору.</p>
      </section>
    </main>
  )
}
export default SignIn
