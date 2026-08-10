import {useState,type ReactNode} from 'react';

type Props={id?:string;title:string;description?:string;children:ReactNode;className?:string;contentClassName?:string;defaultOpen?:boolean};
export function CollapsiblePanel({id,title,description,children,className='',contentClassName='',defaultOpen=true}:Props){const[open,setOpen]=useState(defaultOpen);return <details id={id} className={`card collapsible-panel ${className}`} open={open} onToggle={event=>setOpen(event.currentTarget.open)}><summary><div><h2>{title}</h2>{description&&<p>{description}</p>}</div><span className="collapse-icon" aria-hidden="true"/></summary><div className={`panel-content ${contentClassName}`}>{children}</div></details>}
