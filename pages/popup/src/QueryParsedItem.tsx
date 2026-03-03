import { cn, CopyButton, useButtonClassName } from '@extension/ui';

export const QueryParsedItem = ({
  item,
}: {
  item: {
    key: string;
    value: string;
  };
}) => {
  const { key, value } = item;

  const keyCopy = useButtonClassName();
  const valueCopy = useButtonClassName();
  const objectCopy = useButtonClassName();

  return (
    <div className="flex items-center justify-between w-full rounded-md hover:bg-zinc-100 gap-2 py-1">
      <span className="text-base truncate">
        {key} : {value}
      </span>
      <div className="flex items-center gap-1 shrink-0">
        <CopyButton
          value={key}
          onSuccessCopy={keyCopy.handleSuccess}
          onFailCopy={keyCopy.handleFail}
          className={cn('h-8 px-2 text-xs', keyCopy.className)}>
          key
        </CopyButton>
        <CopyButton
          value={value}
          onSuccessCopy={valueCopy.handleSuccess}
          onFailCopy={valueCopy.handleFail}
          className={cn('h-8 px-2 text-xs', valueCopy.className)}>
          value
        </CopyButton>
        <CopyButton
          value={JSON.stringify({ [key]: value })}
          onSuccessCopy={objectCopy.handleSuccess}
          onFailCopy={objectCopy.handleFail}
          className={cn('h-8 px-2 text-xs', objectCopy.className)}>
          object
        </CopyButton>
      </div>
    </div>
  );
};
