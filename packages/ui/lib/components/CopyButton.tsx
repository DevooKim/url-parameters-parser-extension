import { copyToClipboard } from '@extension/shared';
import type { ComponentPropsWithoutRef } from 'react';
import { Button } from '@ui';
import { Copy } from 'lucide-react';

type CopyButtonProps = ComponentPropsWithoutRef<'button'> & {
  onSuccessCopy?: () => void;
  onFailCopy?: () => void;
};

export const CopyButton = ({ className, children, onSuccessCopy, onFailCopy, ...props }: CopyButtonProps) => {
  const onCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.value;
    copyToClipboard(value)
      .then(copySuccess => {
        if (copySuccess && onSuccessCopy) {
          onSuccessCopy();
        }

        if (!copySuccess && onFailCopy) {
          onFailCopy();
        }
      })
      .catch(() => {
        if (onFailCopy) {
          onFailCopy();
        }
      });
  };

  return (
    <Button size={children ? 'sm' : 'icon'} variant="outline" className={className} onClick={onCopy} {...props}>
      {children}
      <Copy />
    </Button>
  );
};
