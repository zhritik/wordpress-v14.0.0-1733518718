# Style Engine

The Style Engine powering global styles and block customizations.

## Important

This Package is considered experimental at the moment. The idea is to have a package used to generate styles based on a
style object that is consistent between: backend, frontend, block style object and theme.json.

Because this package is experimental and still in development it does not yet generate a `wp.styleEngine` global. To get
there, the following tasks need to be completed:

**TODO List:**

-   Add style definitions for all the currently supported styles in blocks and theme.json.
-   The CSS variable shortcuts for values (for presets...)
-   Support generating styles in the frontend. (Ongoing)
-   Support generating styles in the backend (block supports and theme.json stylesheet). (Ongoing)
-   Refactor all block styles to use the style engine server side. (Ongoing)
-   Consolidate global and block style rendering and enqueuing
-   Refactor all blocks to consistently use the "style" attribute for all customizations (get rid of the preset specific
    attributes).

See [Tracking: Add a Style Engine to manage rendering block styles #38167](https://github.com/WordPress/gutenberg/issues/38167)

## Backend API

### wp_style_engine_get_styles()

Global public function to generate styles from a single style object, e.g., the value of
a [block's attributes.style object](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/theme-json-living/#styles)
or
the [top level styles in theme.json](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
.

_Parameters_

-   _$block_styles_ `array` A block's `attributes.style` object or the top level styles in theme.json
-   _$options_ `array<string|boolean>` An array of options to determine the output.
    -   _context_ `string` An identifier describing the origin of the style object, e.g., 'block-supports' or '
        global-styles'. Default is 'block-supports'. When both `context` and `selector` are set, the style engine will store the CSS rules using the `context` as a key.
    -   _convert_vars_to_classnames_ `boolean` Whether to skip converting CSS var:? values to var( --wp--preset--\* )
        values. Default is `false`.
    -   _selector_ `string` When a selector is passed, `generate()` will return a full CSS rule `$selector { ...rules }`,
        otherwise a concatenated string of properties and values.

_Returns_
`array<string|array>|null`

```php
array(
    'css'           => (string) A CSS ruleset or declarations block formatted to be placed in an HTML `style` attribute or tag.
    'declarations'  => (array) An array of property/value pairs representing parsed CSS declarations.
    'classnames'    => (string) Classnames separated by a space.
);
```

It will return compiled CSS declarations for inline styles, or, where a selector is provided, a complete CSS rule.

To enqueue a style for rendering in the site's frontend, the `$options` array requires the following:

1.  **selector (string)** - this is the CSS selector for your block style CSS declarations.
2.  **context (string)** - this tells the style engine where to store the styles. Styles in the same context will be
    stored together.

`wp_style_engine_get_styles` will return the compiled CSS and CSS declarations array.

#### Usage

```php
$block_styles =  array(
     'spacing' => array( 'padding' => '100px' )
);
$styles = wp_style_engine_get_styles(
    $block_styles,
    array(
        'selector' => '.a-selector',
        'context'  => 'block-supports',
    )
);
print_r( $styles );

/*
array(
    'css'                 => '.a-selector{padding:10px}'
    'declarations'  => array( 'padding' => '100px' )
)
*/
```

### wp_style_engine_get_stylesheet_from_css_rules()

Use this function to compile and return a stylesheet for any CSS rules. The style engine will automatically merge declarations and combine selectors.

This function acts as a CSS compiler, but will also enqueue styles for rendering where `enqueue` and `context` strings are passed in the options.

_Parameters_

-   _$css_rules_ `array<array>`
-   _$options_ `array<string|boolean>` An array of options to determine the output.
    -   _context_ `string` An identifier describing the origin of the style object, e.g., 'block-supports' or '
        global-styles'. When set, the style engine will store the CSS rules using the `context` value as a key.

_Returns_
`string` A compiled CSS string based on `$css_rules`.

#### Usage

```php
$styles = array(
    array(
        'selector'.       => '.wp-pumpkin',
        'declarations' => array( 'color' => 'orange' )
    ),
    array(
        'selector'.       => '.wp-tomato',
        'declarations' => array( 'color' => 'red' )
    ),
    array(
        'selector'.       => '.wp-tomato',
        'declarations' => array( 'padding' => '100px' )
    ),
    array(
        'selector'.       => '.wp-kumquat',
        'declarations' => array( 'color' => 'orange' )
    ),
);

$stylesheet = wp_style_engine_get_stylesheet_from_css_rules(
    $styles,
    array(
        'context'  => 'block-supports', // Indicates that these styles should be stored with block supports CSS.
    )
);
print_r( $stylesheet ); // .wp-pumpkin, .wp-kumquat {color:orange}.wp-tomato{color:red;padding:100px}
```

### wp_style_engine_get_stylesheet_from_store()

Returns compiled CSS from a store, if found.

_Parameters_

-   _$store_name_ `string` An identifier describing the origin of the style object, e.g., 'block-supports' or ' global-styles'. Default is 'block-supports'.

_Returns_
`string` A compiled CSS string from the stored CSS rules.

#### Usage

A use case would be to fetch the stylesheet, which contains all the compiled CSS rules from the store, and enqueue it for rendering on the frontend.

```php
// First register some styles.
$styles = array(
    array(
        'selector'.       => '.wp-apple',
        'declarations' => array( 'color' => 'green' )
    ),
);

$stylesheet = wp_style_engine_get_stylesheet_from_css_rules(
    $styles,
    array(
        'context'  => 'fruit-styles',
        'enqueue'  => true,
    )
);

// Later, fetch compiled rules from store.
$stylesheet = gutenberg_style_engine_get_stylesheet_from_store( 'fruit-styles' );
print_r( $stylesheet ); // .wp-apple{color:green;}
if ( ! empty( $stylesheet ) ) {
    wp_register_style( 'my-stylesheet', false, array(), true, true );
    wp_add_inline_style( 'my-stylesheet', $stylesheet );
    wp_enqueue_style( 'my-stylesheet' );
}
```

## Installation (JS only)

Install the module

```bash
npm install @wordpress/style-engine --save
```

_This package assumes that your code will run in an **ES2015+** environment. If you're using an environment that has
limited or no support for such language features and APIs, you should
include [the polyfill shipped in `@wordpress/babel-preset-default`](https://github.com/WordPress/gutenberg/tree/HEAD/packages/babel-preset-default#polyfill)
in your code._

## Usage

<!-- START TOKEN(Autogenerated API docs) -->

### compileCSS

Generates a stylesheet for a given style object and selector.

_Parameters_

-   _style_ `Style`: Style object, for example, the value of a block's attributes.style object or the top level styles in theme.json
-   _options_ `StyleOptions`: Options object with settings to adjust how the styles are generated.

_Returns_

-   `string`: generated stylesheet.

### getCSSRules

Returns a JSON representation of the generated CSS rules.

_Parameters_

-   _style_ `Style`: Style object, for example, the value of a block's attributes.style object or the top level styles in theme.json
-   _options_ `StyleOptions`: Options object with settings to adjust how the styles are generated.

_Returns_

-   `GeneratedCSSRule[]`: generated styles.

<!-- END TOKEN(Autogenerated API docs) -->

## Glossary

A guide to the terms and variable names referenced by the Style Engine package.

<dl>
  <dt>Block style (Gutenberg internal)</dt>
  <dd>An object comprising a block's style attribute that contains a block's style values. E.g., <code>{ spacing: { margin: '10px' }, color: { ... }, ...  }</code></dd>
  <dt>CSS declaration or (CSS property declaration)</dt>
  <dd>A CSS property paired with a CSS value. E.g., <code>color: pink</code> </dd>
  <dt>CSS declarations block</dt>
  <dd>A set of CSS declarations usually paired with a CSS selector to create a CSS rule.</dd>
  <dt>CSS property</dt>
  <dd>Identifiers that describe stylistic, modifiable features of an HTML element. E.g., <code>border</code>, <code>font-size</code>, <code>width</code>...</dd>
  <dt>CSS rule</dt>
  <dd>A CSS selector followed by a CSS declarations block inside a set of curly braces. Usually found in a CSS stylesheet.</dd>
  <dt>CSS selector</dt>
   <dd>The first component of a CSS rule, a CSS selector is a pattern of elements, classnames or other terms that define the element to which the rule&rsquo;s CSS definitions apply. E.g., <code>p.my-cool-classname > span</code>. See <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors" target="_blank">MDN CSS selectors article</a>.</dd>
  <dt>CSS stylesheet</dt>
  <dd>A collection of CSS rules contained within a file or within an <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style" target="_blank">HTML style tag</a>.</dd>
  <dt>CSS value</dt>
  <dd>The value of a CSS property. The value determines how the property is modified. E.g., the <code>10vw</code> in <code>height: 10vw</code>.</dd>
  <dt>CSS variables (vars) or CSS custom properties</dt>
  <dd>Properties, whose values can be reused in other CSS declarations. Set using custom property notation (e.g., <code>--wp--preset--olive: #808000;</code>) and  accessed using the <code>var()</code> function (e.g., <code>color: var( --wp--preset--olive );</code>). See <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" target="_blank">MDN article on CSS custom properties</a>.</dd>
  <dt>Global styles (Gutenberg internal)</dt>
  <dd>A merged block styles object containing values from a theme's theme.json and user styles settings.</dd>
  <dt>Inline styles</dt>
  <dd>Inline styles are CSS declarations that affect a single HTML element, contained within a style attribute</dd>
  <dt>Processor</dt>
  <dd>Performs compilation and optimization on stored CSS rules. See the class `WP_Style_Engine_Processor`.</dd>
  <dt>Store</dt>
  <dd>A data object that contains related styles. See the class `WP_Style_Engine_CSS_Rules_Store`.</dd>
</dl>

<br/><br/><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>
