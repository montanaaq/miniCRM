import { getClient } from '@/lib/supabase'
import { SIGN_IN_SCHEMA } from '@/shared/types/crm.schema'
import { useBoolean, useLockCallback } from '@siberiacancode/reactuse'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

export const useSignIn = () => {
  const [validationError, setValidationError] = useState('')
  const [passwordVisible, togglePassword] = useBoolean(false)
  const signInMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { error } = await getClient()
        .auth.signInWithPassword(credentials)
        .catch(cause => {
          throw new Error('Сервис входа недоступен. Проверьте подключение и повторите попытку.', {
            cause
          })
        })
      if (error)
        throw new Error(
          'Не удалось войти. Проверьте email и пароль или обратитесь к администратору.'
        )
    }
  })
  const onSubmit = useLockCallback(async (form: HTMLFormElement) => {
    const input = SIGN_IN_SCHEMA.safeParse(Object.fromEntries(new FormData(form)))
    if (!input.success) {
      setValidationError('Укажите корректный email и пароль.')
      return
    }
    setValidationError('')
    try {
      await signInMutation.mutateAsync(input.data)
    } catch {
      // The form renders the mutation error.
    }
  })
  return {
    states: {
      busy: signInMutation.isPending,
      error: validationError || signInMutation.error?.message || '',
      passwordVisible,
      passwordType: passwordVisible ? 'text' : 'password'
    },
    functions: { onSubmit, onTogglePassword: togglePassword }
  }
}
