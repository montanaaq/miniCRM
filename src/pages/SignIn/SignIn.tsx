import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import { ROUTES } from '@/shared/constants/routes.const'
import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldGroup,
  FieldError,
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
  const { states, functions, forms } = useSignIn()
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
        <form method="post" onSubmit={forms.onSubmit} aria-busy={states.busy}>
          <FieldGroup>
            <Field data-disabled={states.busy} data-invalid={!!forms.errors.email}>
              <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
              <Input
                id="sign-in-email"
                {...forms.register('email')}
                aria-invalid={!!forms.errors.email}
                aria-describedby={forms.errors.email ? 'sign-in-email-error' : undefined}
                type="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                disabled={states.busy}
              />
              {forms.errors.email && (
                <FieldError id="sign-in-email-error">Укажите корректный email.</FieldError>
              )}
            </Field>
            <Field data-disabled={states.busy} data-invalid={!!forms.errors.password}>
              <FieldLabel htmlFor="sign-in-password">Пароль</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="sign-in-password"
                  {...forms.register('password')}
                  aria-invalid={!!forms.errors.password}
                  aria-describedby={forms.errors.password ? 'sign-in-password-error' : undefined}
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
              {forms.errors.password && (
                <FieldError id="sign-in-password-error">Введите пароль.</FieldError>
              )}
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
