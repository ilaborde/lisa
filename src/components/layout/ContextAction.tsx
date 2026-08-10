import type {ReactNode} from 'react';
export function ContextAction({children,onClick,active=false}:{children:ReactNode;onClick:()=>void;active?:boolean}){return <button type="button" className="context-action" aria-pressed={active} onClick={onClick}>{children}</button>}
