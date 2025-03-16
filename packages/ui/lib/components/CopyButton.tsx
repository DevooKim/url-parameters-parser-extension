import { copyToClipboard, useTimeout } from '@extension/shared';
import { useState, type ComponentPropsWithoutRef } from 'react';
import { Button } from '@ui';
import { Copy } from 'lucide-react';

type CopyButtonProps = ComponentPropsWithoutRef<'button'> & {
  onSuccessCopy?: () => void;
  onFailCopy?: () => void;
};

const useButtonClassName = () => {
  const [className, setClassName] = useState('');
  const { isActive, reset } = useTimeout(() => setClassName(''), 1000);

  const handleSuccess = () => {
    setClassName('bg-green-500 text-white hover:bg-green-500 hover:text-white');
    reset();
  };
  const handleFail = () => {
    setClassName('bg-red-500 text-white hover:bg-red-500 hover:text-white');
    reset();
  };

  return {
    className,
    handleSuccess,
    handleFail,
    isActive,
  };
};

const CopyButton = ({ className, children, onSuccessCopy, onFailCopy, ...props }: CopyButtonProps) => {
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

export { CopyButton, useButtonClassName };
