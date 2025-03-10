/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import CircularOptionPicker from '../circular-option-picker';
import CustomGradientPicker from '../custom-gradient-picker';
import { VStack } from '../v-stack';
import { ColorHeading } from '../color-palette/styles';
import { Spacer } from '../spacer';

function SingleOrigin( {
	className,
	clearGradient,
	gradients,
	onChange,
	value,
	actions,
	content,
} ) {
	const gradientOptions = useMemo( () => {
		return map( gradients, ( { gradient, name } ) => (
			<CircularOptionPicker.Option
				key={ gradient }
				value={ gradient }
				isSelected={ value === gradient }
				tooltipText={
					name ||
					// translators: %s: gradient code e.g: "linear-gradient(90deg, rgba(98,16,153,1) 0%, rgba(172,110,22,1) 100%);".
					sprintf( __( 'Gradient code: %s' ), gradient )
				}
				style={ { color: 'rgba( 0,0,0,0 )', background: gradient } }
				onClick={
					value === gradient
						? clearGradient
						: () => onChange( gradient )
				}
				aria-label={
					name
						? // translators: %s: The name of the gradient e.g: "Angular red to blue".
						  sprintf( __( 'Gradient: %s' ), name )
						: // translators: %s: gradient code e.g: "linear-gradient(90deg, rgba(98,16,153,1) 0%, rgba(172,110,22,1) 100%);".
						  sprintf( __( 'Gradient code: %s' ), gradient )
				}
			/>
		) );
	}, [ gradients, value, onChange, clearGradient ] );
	return (
		<CircularOptionPicker
			className={ className }
			options={ gradientOptions }
			actions={ actions }
		>
			{ content }
		</CircularOptionPicker>
	);
}

function MultipleOrigin( {
	className,
	clearGradient,
	gradients,
	onChange,
	value,
	actions,
	content,
} ) {
	return (
		<VStack spacing={ 3 } className={ className }>
			{ gradients.map( ( { name, gradients: gradientSet }, index ) => {
				return (
					<VStack spacing={ 2 } key={ index }>
						<ColorHeading>{ name }</ColorHeading>
						<SingleOrigin
							clearGradient={ clearGradient }
							gradients={ gradientSet }
							onChange={ onChange }
							value={ value }
							{ ...( gradients.length === index + 1
								? {
										actions,
										content,
								  }
								: {} ) }
						/>
					</VStack>
				);
			} ) }
		</VStack>
	);
}

export default function GradientPicker( {
	/** Start opting into the new margin-free styles that will become the default in a future version. */
	__nextHasNoMargin = false,
	className,
	gradients,
	onChange,
	value,
	clearable = true,
	disableCustomGradients = false,
	__experimentalHasMultipleOrigins,
	__experimentalIsRenderedInSidebar,
} ) {
	const clearGradient = useCallback(
		() => onChange( undefined ),
		[ onChange ]
	);
	const Component =
		__experimentalHasMultipleOrigins && gradients?.length
			? MultipleOrigin
			: SingleOrigin;

	// Can be removed when deprecation period is over
	const deprecatedMarginSpacerProps = ! __nextHasNoMargin
		? { marginTop: 3 }
		: {};

	return (
		<Component
			className={ className }
			clearable={ clearable }
			clearGradient={ clearGradient }
			gradients={ gradients }
			onChange={ onChange }
			value={ value }
			actions={
				clearable &&
				( gradients?.length || ! disableCustomGradients ) && (
					<CircularOptionPicker.ButtonAction
						onClick={ clearGradient }
					>
						{ __( 'Clear' ) }
					</CircularOptionPicker.ButtonAction>
				)
			}
			content={
				! disableCustomGradients && (
					<Spacer
						marginTop={ gradients?.length ? 3 : 0 }
						marginBottom={ 0 }
						{ ...deprecatedMarginSpacerProps }
					>
						<CustomGradientPicker
							__nextHasNoMargin={ __nextHasNoMargin }
							__experimentalIsRenderedInSidebar={
								__experimentalIsRenderedInSidebar
							}
							value={ value }
							onChange={ onChange }
						/>
					</Spacer>
				)
			}
		/>
	);
}
