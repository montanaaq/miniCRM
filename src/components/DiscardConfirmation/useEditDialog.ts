import { useBoolean } from '@siberiacancode/reactuse'
import { useState } from 'react'

export const useEditDialog = <Record>(record: Record | undefined) => {
  const [editing, setEditing] = useBoolean(false)
  const [confirmDiscard, setConfirmDiscard] = useBoolean(false)
  const [original, setOriginal] = useState(record)

  const onOpen = () => {
    setOriginal(record)
    setConfirmDiscard(false)
    setEditing(true)
  }
  const onClose = () => setEditing(false)
  const onRequestClose = (dirty: boolean) => {
    if (dirty) {
      setConfirmDiscard(true)
      return false
    }
    onClose()
    return true
  }
  return {
    states: { editing, confirmDiscard, original },
    functions: {
      onOpen,
      onClose,
      onRequestClose,
      onKeepEditing: () => setConfirmDiscard(false)
    }
  }
}
