import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Steps, { StepsProps } from './Steps'
import _CustomSteps, { CustomStepsProps } from './CustomSteps'
import StepItem from './StepItem'
import StepItemWithAvatar from './StepItemWithAvatar'

export type { StepsProps } from './Steps'
export type { CustomStepsProps } from './CustomSteps'
export type { StepItemProps } from './StepItem'

type CompoundedComponent = ForwardRefExoticComponent<
    StepsProps & RefAttributes<HTMLDivElement>
> & {
    Item: typeof StepItem
    ItemWithAvatar: typeof StepItemWithAvatar
}

type CustomCompoundedComponent = ForwardRefExoticComponent<
    CustomStepsProps & RefAttributes<HTMLDivElement>
> & {
    Item: typeof StepItem
    StepItemWithAvatar: typeof StepItemWithAvatar
}
const Steps = _Steps as CompoundedComponent
const CustomSteps = _CustomSteps as CustomCompoundedComponent


Steps.Item = StepItem
Steps.ItemWithAvatar = StepItemWithAvatar
CustomSteps.Item = StepItem
CustomSteps.StepItemWithAvatar = StepItemWithAvatar

export { Steps, CustomSteps }

export default Steps
