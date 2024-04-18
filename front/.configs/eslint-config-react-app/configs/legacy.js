/**
 * Legacy Rules
 * Inherited from Create-react-app config
 */
module.exports = {
  rules: {
    '@typescript-eslint/default-param-last': 2,
    '@typescript-eslint/dot-notation': 2,
    '@typescript-eslint/func-call-spacing': 0,
    '@typescript-eslint/lines-between-class-members': [
      2,
      'always',
      {
        exceptAfterOverload: true,
        exceptAfterSingleLine: false,
      },
    ],
    '@typescript-eslint/no-dupe-class-members': 2,
    '@typescript-eslint/no-empty-function': [
      2,
      {
        allow: ['arrowFunctions', 'functions', 'methods'],
      },
    ],
    '@typescript-eslint/no-loop-func': 2,
    '@typescript-eslint/no-magic-numbers': [
      0,
      {
        detectObjects: false,
        enforceConst: true,
        ignore: [],
        ignoreArrayIndexes: true,
      },
    ],
    '@typescript-eslint/no-redeclare': 2,
    '@typescript-eslint/no-shadow': 2,
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        args: 'after-used',
        ignoreRestSiblings: true,
        vars: 'all',
      },
    ],
    '@typescript-eslint/no-unused-expressions': [
      2,
      {
        allowShortCircuit: false,
        allowTaggedTemplates: false,
        allowTernary: false,
        enforceForJSX: false,
      },
    ],
    '@typescript-eslint/no-use-before-define': [
      2,
      {
        classes: true,
        functions: true,
        variables: true,
      },
    ],
    '@typescript-eslint/return-await': [2, 'in-try-catch'],
    'accessor-pairs': 0,
    'array-callback-return': [
      2,
      {
        allowImplicit: true,
        allowVoid: false,
        checkForEach: false,
      },
    ],
    'arrow-body-style': [
      2,
      'as-needed',
      {
        requireReturnForObjectLiteral: false,
      },
    ],
    'block-scoped-var': 2,
    'callback-return': 0,
    camelcase: 0,
    'capitalized-comments': 0,
    complexity: 0,
    'consistent-return': 2,
    'consistent-this': 0,
    curly: 0,
    'default-case': [
      2,
      {
        commentPattern: '^no default$',
      },
    ],
    'default-case-last': 2,
    'default-param-last': 0,
    eqeqeq: [
      2,
      'always',
      {
        null: 'ignore',
      },
    ],
    'func-name-matching': 0,
    'func-names': 1,
    'func-style': 0,
    'getter-return': [
      2,
      {
        allowImplicit: true,
      },
    ],
    'global-require': 2,
    'grouped-accessor-pairs': 2,
    'guard-for-in': 2,
    'handle-callback-err': 0,
    'id-denylist': 0,
    'id-length': 0,
    'id-match': 0,
    'import/default': 0,
    'import/dynamic-import-chunkname': 0,
    'import/exports-last': 0,
    'import/extensions': [
      2,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        mjs: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/first': 2,
    'import/group-exports': 0,
    'import/imports-first': 0,
    'import/max-dependencies': 0,
    'import/named': 2,
    'import/namespace': 0,
    'import/newline-after-import': 2,
    'import/no-absolute-path': 2,
    'import/no-amd': 2,
    'import/no-anonymous-default-export': [
      0,
      {
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowArray: false,
        allowArrowFunction: false,
        allowLiteral: false,
        allowObject: false,
      },
    ],
    'import/no-commonjs': 0,
    'import/no-cycle': [
      2,
      {
        allowUnsafeDynamicCyclicDependency: false,
        ignoreExternal: false,
        maxDepth: '∞',
      },
    ],
    'import/no-default-export': 2,
    'import/no-deprecated': 0,
    'import/no-duplicates': 2,
    'import/no-dynamic-require': 2,
    'import/no-extraneous-dependencies': 0,
    'import/no-import-module-exports': [
      2,
      {
        exceptions: [],
      },
    ],
    'import/no-internal-modules': [
      0,
      {
        allow: [],
      },
    ],
    'import/no-mutable-exports': 2,
    'import/no-named-as-default': 2,
    'import/no-named-as-default-member': 2,
    'import/no-named-default': 2,
    'import/no-named-export': 0,
    'import/no-namespace': 0,
    'import/no-nodejs-modules': 0,
    'import/no-relative-packages': 2,
    'import/no-relative-parent-imports': 0,
    'import/no-restricted-paths': 0,
    'import/no-self-import': 2,
    'import/no-unassigned-import': 0,
    'import/no-unresolved': 2,
    'import/no-unused-modules': 0,
    'import/no-useless-path-segments': [
      2,
      {
        commonjs: true,
      },
    ],
    'import/no-webpack-loader-syntax': 2,
    'import/order': [
      2,
      {
        distinctGroup: true,
        groups: [['builtin', 'external', 'internal']],
        warnOnUnassignedImports: false,
      },
    ],
    'import/prefer-default-export': 0,
    'import/unambiguous': 0,
    'init-declarations': 0,
    'jsx-a11y/accessible-emoji': 0,
    'jsx-a11y/alt-text': [
      2,
      {
        area: [],
        elements: ['img', 'object', 'area', 'input[type="image"]'],
        img: [],
        'input[type="image"]': [],
        object: [],
      },
    ],
    'jsx-a11y/anchor-has-content': [
      2,
      {
        components: [],
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      2,
      {
        aspects: ['noHref', 'invalidHref', 'preferButton'],
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'jsx-a11y/aria-role': [
      2,
      {
        ignoreNonDOM: false,
      },
    ],
    'jsx-a11y/autocomplete-valid': [
      0,
      {
        inputComponents: [],
      },
    ],
    'jsx-a11y/control-has-associated-label': [
      2,
      {
        controlComponents: [],
        depth: 5,
        ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
        ignoreRoles: [
          'grid',
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'row',
          'tablist',
          'toolbar',
          'tree',
          'treegrid',
        ],
        labelAttributes: ['label'],
      },
    ],
    'jsx-a11y/heading-has-content': [
      2,
      {
        components: [''],
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      1,
      {
        assert: 'htmlFor',
      },
    ],
    'jsx-a11y/lang': 2,
    'jsx-a11y/media-has-caption': [
      2,
      {
        audio: [],
        track: [],
        video: [],
      },
    ],
    'jsx-a11y/no-autofocus': [
      2,
      {
        ignoreNonDOM: true,
      },
    ],
    'jsx-a11y/no-distracting-elements': [
      2,
      {
        elements: ['marquee', 'blink'],
      },
    ],
    'jsx-a11y/no-onchange': 0,
    'line-comment-position': 0,
    'lines-around-directive': [
      2,
      {
        after: 'always',
        before: 'always',
      },
    ],
    'max-classes-per-file': [2, 1],
    'max-depth': 0,
    'max-lines': 0,
    'max-lines-per-function': 0,
    'max-nested-callbacks': 0,
    'max-params': 0,
    'max-statements': 0,
    'multiline-comment-style': 0,
    'new-cap': [
      2,
      {
        capIsNew: false,
        capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
        newIsCap: true,
        newIsCapExceptions: [],
        properties: true,
      },
    ],
    'newline-after-var': 0,
    'newline-before-return': 0,
    'no-alert': 1,
    'no-await-in-loop': 2,
    'no-bitwise': 2,
    'no-buffer-constructor': 2,
    'no-caller': 2,
    'no-catch-shadow': 0,
    'no-cond-assign': [2, 'always'],
    'no-console': 1,
    'no-constant-condition': 1,
    'no-constructor-return': 2,
    'no-continue': 2,
    'no-div-regex': 0,
    'no-duplicate-imports': 0,
    'no-else-return': [
      2,
      {
        allowElseIf: false,
      },
    ],
    'no-empty-function': [
      0,
      {
        allow: ['arrowFunctions', 'functions', 'methods'],
      },
    ],
    'no-eq-null': 0,
    'no-eval': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-extra-label': 2,
    'no-global-assign': [
      2,
      {
        exceptions: [],
      },
    ],
    'no-implicit-coercion': [
      0,
      {
        allow: [],
        boolean: false,
        number: true,
        string: true,
      },
    ],
    'no-implicit-globals': 0,
    'no-inline-comments': 0,
    'no-invalid-this': 0,
    'no-iterator': 2,
    'no-label-var': 2,
    'no-labels': [
      2,
      {
        allowLoop: false,
        allowSwitch: false,
      },
    ],
    'no-lone-blocks': 2,
    'no-lonely-if': 2,
    'no-loop-func': 0,
    'no-magic-numbers': [
      0,
      {
        detectObjects: false,
        enforceConst: true,
        ignore: [],
        ignoreArrayIndexes: true,
      },
    ],
    'no-mixed-requires': 0,
    'no-multi-assign': 2,
    'no-multi-str': 2,
    'no-native-reassign': 0,
    'no-negated-condition': 0,
    'no-negated-in-lhs': 0,
    'no-nested-ternary': 2,
    'no-new': 2,
    'no-new-func': 0,
    'no-new-object': 2,
    'no-new-require': 2,
    'no-new-wrappers': 2,
    'no-octal-escape': 2,
    'no-param-reassign': [
      2,
      {
        ignorePropertyModificationsFor: [
          'acc',
          'accumulator',
          'e',
          'ctx',
          'context',
          'req',
          'request',
          'res',
          'response',
          '$scope',
          'staticContext',
        ],
        props: true,
      },
    ],
    'no-path-concat': 2,
    'no-plusplus': 2,
    'no-process-env': 0,
    'no-process-exit': 0,
    'no-promise-executor-return': 2,
    'no-proto': 2,
    'no-redeclare': 2,
    'no-restricted-exports': [
      2,
      {
        restrictedNamedExports: ['default', 'then'],
      },
    ],
    'no-restricted-globals': [
      2,
      {
        message:
          'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
        name: 'isFinite',
      },
      {
        message:
          'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
        name: 'isNaN',
      },
      'addEventListener',
      'blur',
      'close',
      'closed',
      'confirm',
      'defaultStatus',
      'defaultstatus',
      'event',
      'external',
      'find',
      'focus',
      'frameElement',
      'frames',
      'history',
      'innerHeight',
      'innerWidth',
      'length',
      'location',
      'locationbar',
      'menubar',
      'moveBy',
      'moveTo',
      'name',
      'onblur',
      'onerror',
      'onfocus',
      'onload',
      'onresize',
      'onunload',
      'open',
      'opener',
      'opera',
      'outerHeight',
      'outerWidth',
      'pageXOffset',
      'pageYOffset',
      'parent',
      'print',
      'removeEventListener',
      'resizeBy',
      'resizeTo',
      'screen',
      'screenLeft',
      'screenTop',
      'screenX',
      'screenY',
      'scroll',
      'scrollbars',
      'scrollBy',
      'scrollTo',
      'scrollX',
      'scrollY',
      'self',
      'status',
      'statusbar',
      'stop',
      'toolbar',
      'top',
    ],
    'no-restricted-imports': 0,
    'no-restricted-modules': 0,
    'no-restricted-properties': [
      2,
      {
        message: 'arguments.callee is deprecated',
        object: 'arguments',
        property: 'callee',
      },
      {
        message: 'Please use Number.isFinite instead',
        object: 'global',
        property: 'isFinite',
      },
      {
        message: 'Please use Number.isFinite instead',
        object: 'self',
        property: 'isFinite',
      },
      {
        message: 'Please use Number.isFinite instead',
        object: 'window',
        property: 'isFinite',
      },
      {
        message: 'Please use Number.isNaN instead',
        object: 'global',
        property: 'isNaN',
      },
      {
        message: 'Please use Number.isNaN instead',
        object: 'self',
        property: 'isNaN',
      },
      {
        message: 'Please use Number.isNaN instead',
        object: 'window',
        property: 'isNaN',
      },
      {
        message: 'Please use Object.defineProperty instead.',
        property: '__defineGetter__',
      },
      {
        message: 'Please use Object.defineProperty instead.',
        property: '__defineSetter__',
      },
      {
        message: 'Use the exponentiation operator (**) instead.',
        object: 'Math',
        property: 'pow',
      },
    ],
    'no-restricted-syntax': [
      2,
      {
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        selector: 'ForInStatement',
      },
      {
        message:
          'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
        selector: 'ForOfStatement',
      },
      {
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        selector: 'LabeledStatement',
      },
      {
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        selector: 'WithStatement',
      },
    ],
    'no-return-assign': [2, 'always'],
    'no-return-await': 0,
    'no-script-url': 2,
    'no-self-assign': [
      2,
      {
        props: true,
      },
    ],
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-shadow': 0,
    'no-sync': 0,
    'no-template-curly-in-string': 2,
    'no-ternary': 0,
    'no-undef-init': 2,
    'no-undefined': 0,
    'no-underscore-dangle': [
      2,
      {
        allow: ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'],
        allowAfterSuper: false,
        allowAfterThis: false,
        allowAfterThisConstructor: false,
        allowFunctionParams: true,
        allowInArrayDestructuring: true,
        allowInObjectDestructuring: true,
        enforceInClassFields: false,
        enforceInMethodNames: true,
      },
    ],
    'no-unmodified-loop-condition': 0,
    'no-unneeded-ternary': [
      2,
      {
        defaultAssignment: false,
      },
    ],
    'no-unreachable-loop': [
      2,
      {
        ignore: [],
      },
    ],
    'no-unsafe-optional-chaining': [
      2,
      {
        disallowArithmeticOperators: true,
      },
    ],
    'no-unused-expressions': [
      0,
      {
        allowShortCircuit: false,
        allowTaggedTemplates: false,
        allowTernary: false,
        enforceForJSX: false,
      },
    ],
    'no-unused-private-class-members': 0,
    'no-use-before-define': 0,
    'no-useless-call': 0,
    'no-useless-computed-key': 2,
    'no-useless-concat': 2,
    'no-useless-rename': [
      2,
      {
        ignoreDestructuring: false,
        ignoreExport: false,
        ignoreImport: false,
      },
    ],
    'no-useless-return': 2,
    'no-var': 2,
    'no-void': 2,
    'no-warning-comments': [
      0,
      {
        location: 'start',
        terms: ['todo', 'fixme', 'xxx'],
      },
    ],
    'one-var': [2, 'never'],
    'operator-assignment': [2, 'always'],
    'prefer-arrow-callback': [
      2,
      {
        allowNamedFunctions: false,
        allowUnboundThis: true,
      },
    ],
    'prefer-const': [
      2,
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: true,
      },
    ],
    'prefer-destructuring': [
      2,
      {
        AssignmentExpression: {
          array: true,
          object: false,
        },
        VariableDeclarator: {
          array: false,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'prefer-exponentiation-operator': 2,
    'prefer-named-capture-group': 0,
    'prefer-numeric-literals': 2,
    'prefer-object-spread': 2,
    'prefer-promise-reject-errors': [
      2,
      {
        allowEmptyReject: true,
      },
    ],
    'prefer-reflect': 0,
    'prefer-regex-literals': [
      2,
      {
        disallowRedundantWrapping: true,
      },
    ],
    'prefer-rest-params': 2,
    'prefer-spread': 2,
    'prefer-template': 2,
    radix: 2,
    'react-hooks/exhaustive-deps': 2,
    'react-hooks/rules-of-hooks': 2,
    'react/boolean-prop-naming': [
      0,
      {
        message: '',
        propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
        rule: '^(is|has)[A-Z]([A-Za-z0-9]?)+',
      },
    ],
    'react/button-has-type': [
      0,
      {
        button: true,
        reset: false,
        submit: true,
      },
    ],
    'react/default-props-match-prop-types': [
      2,
      {
        allowRequiredDefaults: false,
      },
    ],
    'react/destructuring-assignment': [2, 'always'],
    'react/forbid-component-props': [
      0,
      {
        forbid: [],
      },
    ],
    'react/forbid-dom-props': [
      0,
      {
        forbid: [],
      },
    ],
    'react/forbid-elements': [
      0,
      {
        forbid: [],
      },
    ],
    'react/forbid-foreign-prop-types': [
      'warn',
      {
        allowInPropTypes: true,
      },
    ],
    'react/forbid-prop-types': [
      2,
      {
        checkChildContextTypes: true,
        checkContextTypes: true,
        forbid: ['any', 'array', 'object'],
      },
    ],
    'react/function-component-definition': [
      0,
      {
        namedComponents: ['function-declaration', 'function-expression'],
        unnamedComponents: 'function-expression',
      },
    ],
    'react/jsx-boolean-value': [
      2,
      'never',
      {
        always: [],
      },
    ],
    'react/jsx-closing-bracket-location': [
      2,
      {
        nonEmpty: 'after-props',
        selfClosing: false,
      },
    ],
    'react/jsx-curly-brace-presence': [
      2,
      {
        children: 'never',
        props: 'never',
      },
    ],
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    'react/jsx-first-prop-new-line': 0,
    'react/jsx-fragments': [2, 'element'],
    'react/jsx-handler-names': [
      0,
      {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      },
    ],
    'react/jsx-indent': [
      2,
      2,
      {
        checkAttributes: false,
        indentLogicalExpressions: true,
      },
    ],
    'react/jsx-indent-props': 0,
    'react/jsx-max-depth': 0,
    'react/jsx-max-props-per-line': [
      0,
      {
        maximum: 1,
        when: 'multiline',
      },
    ],
    'react/jsx-no-bind': [
      2,
      {
        allowArrowFunctions: true,
        allowBind: false,
        allowFunctions: false,
        ignoreDOMComponents: true,
        ignoreRefs: true,
      },
    ],
    'react/jsx-no-constructed-context-values': 0,
    'react/jsx-no-duplicate-props': [
      2,
      {
        ignoreCase: true,
      },
    ],
    'react/jsx-no-literals': [
      0,
      {
        noStrings: true,
      },
    ],
    'react/jsx-no-script-url': [
      2,
      [
        {
          name: 'Link',
          props: ['to'],
        },
      ],
    ],
    'react/jsx-no-target-blank': [
      2,
      {
        enforceDynamicLinks: 'always',
        forms: false,
        links: true,
      },
    ],
    'react/jsx-no-useless-fragment': 2,
    'react/jsx-one-expression-per-line': [
      0,
      {
        allow: 'single-child',
      },
    ],
    'react/jsx-pascal-case': [
      2,
      {
        allowAllCaps: true,
        ignore: [],
      },
    ],
    'react/jsx-props-no-spreading': [
      1,
      {
        custom: 'enforce',
        exceptions: ['input'],
        explicitSpread: 'ignore',
        html: 'enforce',
      },
    ],
    'react/jsx-sort-default-props': [
      0,
      {
        ignoreCase: true,
      },
    ],
    'react/jsx-sort-prop-types': 0,
    'react/jsx-sort-props': [
      2,
      {
        callbacksLast: true,
        ignoreCase: true,
        locale: 'auto',
        multiline: 'ignore',
        noSortAlphabetically: false,
        reservedFirst: true,
        shorthandFirst: true,
      },
    ],
    'react/jsx-space-before-closing': 0,
    'react/jsx-tag-spacing': [
      0,
      {
        afterOpening: 'never',
        beforeClosing: 'never',
        beforeSelfClosing: 'always',
        closingSlash: 'never',
      },
    ],
    'react/jsx-wrap-multilines': [
      0,
      {
        arrow: 'parens-new-line',
        assignment: 'parens-new-line',
        condition: 'parens-new-line',
        declaration: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
        return: 'parens-new-line',
      },
    ],
    'react/no-access-state-in-setstate': 2,
    'react/no-adjacent-inline-elements': 0,
    'react/no-array-index-key': 2,
    'react/no-arrow-function-lifecycle': 2,
    'react/no-danger': 1,
    'react/no-did-mount-set-state': 0,
    'react/no-did-update-set-state': 2,
    'react/no-invalid-html-attribute': 2,
    'react/no-multi-comp': 0,
    'react/no-namespace': 2,
    'react/no-redundant-should-component-update': 2,
    'react/no-set-state': 0,
    'react/no-this-in-sfc': 2,
    'react/no-typos': 2,
    'react/no-unstable-nested-components': 2,
    'react/no-unused-class-component-methods': 2,
    'react/no-unused-prop-types': [
      2,
      {
        customValidators: [],
        skipShapeProps: true,
      },
    ],
    'react/no-unused-state': 2,
    'react/no-will-update-set-state': 2,
    'react/prefer-es6-class': [2, 'always'],
    'react/prefer-exact-props': 2,
    'react/prefer-read-only-props': 0,
    'react/prefer-stateless-function': [
      2,
      {
        ignorePureComponents: true,
      },
    ],
    'react/prop-types': [
      2,
      {
        customValidators: [],
        ignore: [],
        skipUndeclared: false,
      },
    ],
    'react/require-default-props': [
      0,
      {
        forbidDefaultForRequired: true,
      },
    ],
    'react/require-optimization': [
      0,
      {
        allowDecorators: [],
      },
    ],
    'react/self-closing-comp': 2,
    'react/sort-comp': [
      2,
      {
        groups: {
          lifecycle: [
            'displayName',
            'propTypes',
            'contextTypes',
            'childContextTypes',
            'mixins',
            'statics',
            'defaultProps',
            'constructor',
            'getDefaultProps',
            'getInitialState',
            'state',
            'getChildContext',
            'getDerivedStateFromProps',
            'componentWillMount',
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'UNSAFE_componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'UNSAFE_componentWillUpdate',
            'getSnapshotBeforeUpdate',
            'componentDidUpdate',
            'componentDidCatch',
            'componentWillUnmount',
          ],
          rendering: ['/^render.+$/', 'render'],
        },
        order: [
          'static-variables',
          'static-methods',
          'instance-variables',
          'lifecycle',
          '/^handle.+$/',
          '/^on.+$/',
          'getters',
          'setters',
          '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
          'instance-methods',
          'everything-else',
          'rendering',
        ],
      },
    ],
    'react/sort-prop-types': [
      0,
      {
        callbacksLast: false,
        ignoreCase: true,
        requiredFirst: false,
        sortShapeProp: true,
      },
    ],
    'react/state-in-constructor': [2, 'always'],
    'react/static-property-placement': [2, 'property assignment'],
    'react/style-prop-object': 2,
    'react/void-dom-elements-no-children': 2,
    'require-atomic-updates': 0,
    'require-jsdoc': 0,
    'require-unicode-regexp': 0,
    'simple-import-sort/exports': 2,
    'sort-imports': [
      0,
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'sort-keys': [
      2,
      'asc',
      {
        allowLineSeparatedGroups: false,
        caseSensitive: true,
        minKeys: 2,
        natural: false,
      },
    ],
    'sort-vars': 0,
    'space-unary-ops': [
      0,
      {
        nonwords: false,
        overrides: {},
        words: true,
      },
    ],
    strict: [2, 'never'],
    'symbol-description': 2,
    'unicode-bom': [2, 'never'],
    'valid-jsdoc': 0,
    'valid-typeof': [
      2,
      {
        requireStringLiterals: true,
      },
    ],
    'vars-on-top': 2,
    yoda: 2,
  },
};
