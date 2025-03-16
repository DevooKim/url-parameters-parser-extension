import { cn, CopyButton, useButtonClassName } from '@extension/ui';

export const ParsedItem = ({
  item,
}: {
  item: {
    key: string;
    value: string;
  };
}) => {
  const { className: buttonClassName, handleSuccess, handleFail } = useButtonClassName();

  const { key, value } = item;

  return (
    <div className="flex items-center justify-between w-full rounded-md hover:bg-zinc-100">
      <span className="text-base truncate">
        {key} : {value}
      </span>
      <CopyButton
        value={value}
        onSuccessCopy={handleSuccess}
        onFailCopy={handleFail}
        className={cn('w-8 h-8 shrink-0', buttonClassName)}
      />
    </div>
  );
};
