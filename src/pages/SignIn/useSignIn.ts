import { getClient } from '@/lib/supabase'
import { SIGN_IN_SCHEMA } from '@/shared/types/crm.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBoolean, useLockCallback } from '@siberiacancode/reactuse'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

export const useSignIn = () => {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(SIGN_IN_SCHEMA),
    defaultValues: { email: '', password: '' }
  })
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
  const signIn = useLockCallback(async (input: { email: string; password: string }) => {
    try {
      await signInMutation.mutateAsync(input)
    } catch {}
  })
  return {
    states: {
      busy: signInMutation.isPending,
      error: signInMutation.error?.message || '',
      passwordVisible,
      passwordType: passwordVisible ? 'text' : 'password'
    },
    functions: { onTogglePassword: togglePassword },
    forms: { register, errors: formState.errors, onSubmit: handleSubmit(signIn) }
  }
}
