import type { ReactNode, ElementType } from 'react'
import styles from './Container.module.css'

type ContainerProps<T extends ElementType = 'div'> = {
    as?: T
    title?: ReactNode
    actions?: ReactNode
    noPadding?: boolean
    className?: string
    children?: ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export function Container<T extends ElementType = 'div'>({
    as,
    title,
    actions,
    noPadding,
    className,
    children,
    ...rest
}: ContainerProps<T>) {
    const Component = (as || 'div') as ElementType
    const classes = [
        styles._container,
        noPadding ? styles._noPadding : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <Component className={classes} {...rest}>
            {(title || actions) && (
                <div className={styles._header}>
                    {title ? <h3 className={styles._title}>{title}</h3> : null}
                    {actions}
                </div>
            )}
            {children}
        </Component>
    )
}

export default Container