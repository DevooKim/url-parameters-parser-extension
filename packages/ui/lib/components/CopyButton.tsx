import { copyToClipboard } from '@extension/shared';
import type { ComponentPropsWithoutRef } from 'react';
import { Button } from '@ui';
import { Copy } from '@mynaui/icons-react';

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
    <Button size="icon" variant="outline" className={className} onClick={onCopy} {...props}>
      <Copy />
    </Button>
  );

  return (
    <button
      className={`py-1 px-4 rounded shadow hover:scale-105 bg-white text-black border-black mt-4 border-2 font-bold ${className}`}
      onClick={onCopy}
      {...props}>
      {children}
    </button>
  );
};
