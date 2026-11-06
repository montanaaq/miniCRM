import { useBoolean } from '@siberiacancode/reactuse'
import { useState } from 'react'

export const useEditDialog = <Record>(record: Record | undefined) => {
  const [editing, setEditing] = useBoolean(false)
  const [dirty, setDirty] = useBoolean(false)
  const [confirmDiscard, setConfirmDiscard] = useBoolean(false)
  const [original, setOriginal] = useState(record)

  const onOpen = () => {
    setOriginal(record)
    setDirty(false)
    setConfirmDiscard(false)
    setEditing(true)
  }
  const onClose = () => setEditing(false)
  const onRequestClose = () => {
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
      onChange: () => setDirty(true),
      onKeepEditing: () => setConfirmDiscard(false)
    }
  }
}
