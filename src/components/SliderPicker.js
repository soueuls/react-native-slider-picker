/**
 * react-native-slider-picker - NPM Package
 *
 * @module /SliderPicker
 * @description Generic pre-styled slide picker input.
 * @param {String} accessibilityLabel - Optional. Passed to accessibilityLabel prop on numeric TextInput if screen reader is enabled and convertToNumericInputOnScreenReader is `true`. Defaults to an empty string.
 * @param {String} accessibilityHint - Optional. Passed to accessibilityHint prop on numeric TextInput if screen reader is enabled and convertToNumericInputOnScreenReader is `true`. Defaults to an empty string.
 * @param {String} buttonBackgroundColor - Optional. Sets background color of Slider's button. Can pass valid React Native color keywords, hexidecimal, rgb(), or rgba() values. Defaults to `"white"`.
 * @param {String} buttonBorderColor - Optional. Sets border color of Slider's button. Can pass valid React Native color keywords, hexidecimal, rgb(), or rgba() values. Defaults to `"dimgrey"`.
 * @param {Number} buttonBorderWidth - Optional. Sets border width of Slider's button. Defaults to `1`.
 * @param {Number} buttonDimensionsPercentage - Optional. Sets height and width of Slider's button as percentage of viewport width. Defaults to `1`.
 * @param {Function} callback - Optional. Called on change. Defaults to '() => {}'.
 * @param {Boolean} convertToNumericInputOnScreenReader - Optional. Determines if the component should be converted to a numeric typed TextInput component. Defaults to true.
 * @param {Number} defaultValue - Optional. Default value. Defaults to `5`. If valued passed is greater than maxValue, the value will be set to that of maxValue.
 * @param {Number} errorToleranceMargin - Optional. Defaults to `50`. Margin of error for user to move drag off of the cursor along the Y Axis of the screen/component. If user drags beyond this amount of units in either vertical direction the PanResponder event will not update position of cursor. Is checked to ensure a `Number` type is passed that is greater than `0`.
 * @param {String} fillColor - Optional. Sets fill color of inner slider. Can pass valid React Native color keywords, hexidecimal, rgb(), or rgba() values. Defaults to `"dodgerblue"`.
 * @param {Number} heightPercentage - Optional. Percentage of device's viewport to set as component's height. Defaults to `1`.
 * @param {String} labelFontColor - Optional. Sets font color of labels if they are displayed. Can pass valid React Native color keywords, hexidecimal, rgb(), or rgba() values. Defaults to `"dimgrey"`.
 * @param {Number} labelFontSize - Optional. Sets font size of labels if they are displayed. Defaults to `28`.
 * @param {String} labelFontWeight - Optional. Sets font weight of labels if they are displayed. Defaults to `"normal"`.
 * @param {String} maxLabel - Optional. Label for the maximum value. Defaults to an empty `<View>` component.
 * @param {Number} maxValue - Optional. The maximum value/high end of range for the Slider. Defaults to `10`.
 * @param {String} midLabel - Optional. Label for the medium value. Defaults to an empty `<View>` component.
 * @param {String} minLabel - Optional. Label for the minimum value. Defaults to an empty `<View>` component.
 * @param {Object} numericInputContainerStyles - Optional. StyleSheet rules passed to the `<View>` component that wraps `<TextInput>` in numeric input for screen readers. Defaults to `{ width: vw(25), flexDirection: 'row',backgroundColor: '#f1f4f5', borderBottomColor: "#889cb2", borderBottomWidth: vh(1) / 3, marginHorizontal: vw(5), marginVertical: vh(2), padding: vw(4), borderTopLeftRadius: 10, borderTopRightRadius: 10, ... Platform.isPad ? ({  marginTop: vh(4)}) : null }`
 * @param {Object} numericInputTextInputStyles - Optional. StyleSheet rules passed to the `<TextInput>` component in numeric input for screen readers. Defaults to `{ flex: 1, fontSize: Math.ceil(vw(3) * 1.3), ... Platform.select({ ios: {    marginTop: vw(2)  }, android: { paddingBottom: 0, paddingTop: 5  }}) }`
 * @param {String} scaleNumberFontColor - Optional. Sets font color of scale numbers if they are displayed. Can pass valid React Native color keywords, hexidecimal, rgb(), or rgba() values. Defaults to "dimgrey".
 * @param {Number} scaleNumberFontSize - Optional. Sets font size of scale numbers if they are displayed. Defaults to `24`.
 * @param {String} scaleNumberFontWeight - Optional. Sets font weight of scale numbers if they are displayed.  Defaults to `"normal"`.
 * @param {Boolean} showFill - Optional. Boolean value to determine whether or not the slider inner shows a fill or if it is transparent. Defaults to `true`.
 * @param {Boolean} showNumberScale - Optional. Boolean value to determine whether or not to display scale of numbers for the Slider's range. Defaults to `false`.
 * @param {Boolean} showSeparatorScale - Optional. Boolean value to determine whether or not to display lines dividing the slider into different sections. Defaults to `false`. If maxValue is greater than 10 or widtherPercentage is greater than or equal to 50, will be forced to false.
 * @param {Function} slideBeginCallback  - Optional. Callback function to be executed when Slider's touch event begins. Called in `onPanResponderGrant` property of the component's `panResponder`. Defaults to `() => {}`.
 * @param {String} sliderInnerBackgroundColor - Optional. Sets background color of inner slider View. Can pass valid React Native color keywords, hexidecimal, rgb(), or rgba() values. Defaults to `"white"`.
 * @param {Object} sliderInnerBorderStyles - Optional. An object of StyleSheet properties to set border-related styles of sliderInner View component. If passed, the object is filtered to remove any key/value properties that aren't for component's border. Defaults to {}.
 * @param {Number} widthPercentage - Optional. Percentage of device's viewport to set as component's width. 
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React, { Component } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { vh, vw } from 'react-native-css-vh-vw';

// Components
import { SliderPickerCursor } from './SliderPickerCursor';

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
export class SliderPicker extends Component {
  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    //
    // Styled empty View to set as label value if respective prop is not passed.
    // 
    this.emptyLabel = (<View style={{ flex: 1 }}></View>);

    // Default border styles in case nothing is passed.
    this.defaultSliderInnerBorderStyles = {
      borderWidth: vw(1) / 2,
      borderColor: '#d9dce4', 
      borderBottomColor: '#f1f4f5',
      borderRadius: 50,
    }

    // Default styles for View container of accessibility/screen reader numeric input replacement
    this.defaultNumericInputContainerStyles = {
      width: vw(25),
      flexDirection: 'row',
      backgroundColor: '#f1f4f5',
      borderBottomColor: "#889cb2",
      borderBottomWidth: vh(1) / 3,
      marginHorizontal: vw(5),
      marginVertical: vh(2),
      padding: vw(4),
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      ... Platform.isPad ? ({
        marginTop: vh(4)
      }) : null
    }

    // Default styles for TextInput of accessibility/screen reader numeric input replacement
    this.defaultNumericInputTextInputStyles = {
      flex: 1,
      fontSize: Math.ceil(vw(3) * 1.3),
      ... Platform.select({
        ios: {
          marginTop: vw(2)
        },
        android: {
          paddingBottom: 0,
          paddingTop: 5
        }
      })
    }

    //
    // Props checking for overriding element styles
    //
    this.buttonStylesOverride = this.props.buttonStylesOverride ? this.props.buttonStylesOverride : null;
    this.labelStylesOverride = this.props.labelStylesOverride ? this.props.labelStylesOverride : null;
    this.numberStylesOverride = this.props.numberStylesOverride ? this.props.numberStylesOverride : null;
    this.selectionFillStylesOverride = this.props.selectionFillStylesOverride ? this.props.selectionFillStylesOverride : null;
    this.separatorStylesOverride = this.props.separatorStylesOverride ? this.props.separatorStylesOverride : null;
    this.sliderInnerStylesOverride = this.props.sliderInnerStylesOverride ? this.props.sliderInnerStylesOverride : null;

    // Initialize dynamic style objects
    this.labelsContainerStyles = Object.assign({}, styles.labelsContainer);

    this.labelStyles = this.labelStylesOverride ?
      Object.assign({}, this.labelStylesOverride) :
      Object.assign({}, styles.label);

    //
    // Functional Props checking
    //
    this.callback =  this.props.callback ? this.props.callback : () => {};
    this.defaultValue = this.defaultValueCheckHandler(this.props.defaultValue) ? this.props.defaultValue : 5;
    this.maxValue = this.props.maxValue ? this.props.maxValue : 10;
    this.slideBeginCallback = this.props.slideBeginCallback ? this.props.slideBeginCallback : () => {};
    this.errorToleranceMargin = this.props.errorToleranceMargin ? this.props.errorToleranceMargin : 50;

    // Make sure that value of errorToleranceMargin is a Number greater than 0
    if (isNaN(this.errorToleranceMargin) || this.errorToleranceMargin < 0) {
      this.errorToleranceMargin = null;
    }

    //
    // General Styling Props checking
    //
    this.fillColor =  this.props.fillColor ? this.props.fillColor : 'dodgerblue';
    this.heightPercentage =  this.props.heightPercentage ? this.props.heightPercentage : 1;
    this.maxLabel = this.props.maxLabel ? this.labelGenerator(this.props.maxLabel, 'right') : this.emptyLabel;
    this.midLabel = this.props.midLabel ? this.labelGenerator(this.props.midLabel, 'center') : this.emptyLabel;
    this.minLabel = this.props.minLabel ? this.labelGenerator(this.props.minLabel, 'left') : this.emptyLabel;
    this.showFill = this.props.showFill === false ? false : true;
    this.showNumberScale = this.props.showNumberScale ? this.props.showNumberScale : false;
    this.showSeparatorScale = this.props.showSeparatorScale ? this.props.showSeparatorScale : false;
    this.widthPercentage = this.props.widthPercentage ? this.props.widthPercentage : 85;

    //
    // Specific Styling Props checking
    //
    this.buttonBackgroundColor =  this.props.buttonBackgroundColor ? this.props.buttonBackgroundColor : 'white';
    this.buttonBorderColor =  this.props.buttonBorderColor ? this.props.buttonBorderColor : 'dimgrey';
    this.buttonBorderWidth = this.props.buttonBorderWidth ? this.props.buttonBorderWidth : 1;
    this.buttonDimensionsPercentage = this.props.buttonDimensionsPercentage ? this.props.buttonDimensionsPercentage : 6;
    this.labelFontColor = this.props.labelFontColor ? this.props.labelFontColor : 'dimgrey';
    this.labelFontSize = this.props.labelFontSize ? this.props.labelFontSize : 28;
    this.labelFontWeight = this.props.labelFontWeight ? this.props.labelFontWeight : 'normal';
    this.scaleNumberFontColor = this.props.scaleNumberFontColor ? this.props.scaleNumberFontColor : 'dimgrey';
    this.scaleNumberFontSize = this.props.scaleNumberFontSize ? this.props.scaleNumberFontSize : 24;
    this.scaleNumberFontWeight = this.props.scaleNumberFontWeight ? this.props.scaleNumberFontWeight : 'normal';
    this.sliderInnerBackgroundColor = this.props.sliderInnerBackgroundColor ? this.props.sliderInnerBackgroundColor : 'white';
    this.sliderInnerBorderStyles = this.props.sliderInnerBorderStyles ? this.props.sliderInnerBorderStyles : this.defaultSliderInnerBorderStyles;

    // If maxValue is greater than 10 or if slider will take up less than 50% of
    // viewport width, force scale-related values to false.
    if (this.maxValue > 10 || this.widthPercentage <= 50) {
      this.showNumberScale = false;
      this.showSeparatorScale = false;
    }

    // Make sure that defaultValue isn't out of range
    if (this.defaultValue > this.maxValue) {
      this.defaultValue = this.maxValue;
    }

    //
    // AccessibilityInfo props checking
    //
    this.accessibilityLabel = this.props.accessibilityLabel ? String(this.props.accessibilityLabel) : '';
    this.accessibilityHint = this.props.accessibilityHint ? String(this.props.accessibilityHint) : '';
    this.convertToNumericInputOnScreenReader = this.props.convertToNumericInputOnScreenReader === false ? false : true;

    //
    // Styling props for screen reader numeric input container styles
    //
    this.numericInputContainerStyles = this.props.numericInputContainerStyles ? 
      this.props.numericInputContainerStyles :
      this.defaultNumericInputContainerStyles;

    this.numericInputTextInputStyles = this.props.numericInputTextInputStyles ?
      this.props.numericInputTextInputStyles :
      this.defaultNumericInputTextInputStyles;

    //
    // Initialize state variables
    //
    this.state = {
      currentValue: this.defaultValue,
      triggerNonDraggablePress: false,
      nonDraggablePressLocation: null,
      screenReaderEnabled: false,
      numericInputValue: ""
    }

    // Sets styles pre-render
    this.setPreRenderStyles();
  }

  /**
   * Render
   */
  render() {

    //
    // Dynamic styles that update with state
    //

    // Make copy of styles.selectionFill to modify programmatically below
    let selectionFillStyles = this.selectionFillStylesOverride ? 
      Object.assign({}, this.selectionFillStylesOverride) :
      Object.assign({}, styles.selectionFill);

    // Set height of selectionFillStyles according to value of heightPercentage passed.
    selectionFillStyles['height'] = vh(this.heightPercentage) - (this.sliderInnerBorderStyles['borderWidth'] * 2);

    // Set width of selectionFillStyles to result of this.handleSelectionFillWidth()
    selectionFillStyles['width'] = this.handleSelectionFillWidth();
    selectionFillStyles['position'] = 'absolute';

    // Set backgroundColor of sliderInnerStyles based on props.heightPercentage
    this.styleChecker(selectionFillStyles, 'backgroundColor', this.fillColor);

    // Make copy of styles.sliderInner to modify programmatically below
    let sliderInnerStyles = this.sliderInnerStylesOverride ? 
      Object.assign({}, this.sliderInnerStylesOverride) : 
      Object.assign({}, styles.sliderInner);

    // Set height of sliderInnerStyles based on props.heightPercentage
    this.styleChecker(sliderInnerStyles, 'height', vh(this.heightPercentage));
    this.styleChecker(sliderInnerStyles, 'backgroundColor', this.sliderInnerBackgroundColor);

    // Set width of sliderInnerStyles based on props.widthPercentage
    sliderInnerStyles['width'] = vw(this.widthPercentage);

    // Make copies of styles.wrapper with a set width.
    let wrapperStyles = Object.assign({}, styles.wrapper);

    // Set width of wrapper to value passed to props.widthPercentage
    wrapperStyles['width'] = vw(this.widthPercentage);

    // Add some bottom margin if number scale is not being shown
    if (!this.showNumberScale) {
      wrapperStyles['marginBottom'] = vh(2);
    }

    // If screen reader is enabled and convert to number input prop is true, return numeric TextInput
    if (this.state.screenReaderEnabled && this.convertToNumericInputOnScreenReader) {
      return (
        <View style={this.numericInputContainerStyles}
              accessible={true}
              accessibilityLabel={this.accessibilityLabel}
              accessibilityHint={this.accessibilityHint}
        >
          <TextInput
            keyboardType="numeric"
            placeholder={String(this.defaultValue)}
            onChangeText={(val) => this.handleNumericInputChange(val)}
            value={this.state.numericInputValue}
            style={this.numericInputTextInputStyles}
          />
        </View>
      )
    }

    return (
      // Wrapper for slider
      <TouchableOpacity
        style={wrapperStyles}
        activeOpacity={1}
        onPress={(evt) => this.handleWrapperPress(evt.nativeEvent.locationX)}
      >
  
        { /* Labels */ }
        <View style={this.labelsContainerStyles}>
          {this.minLabel}
          {this.midLabel}
          {this.maxLabel}
        </View>
  
        {/* Slider itself */}
        <View style={[sliderInnerStyles, this.sliderInnerBorderStyles]}>

          {/* Styled "fill" bar */}
          {this.showFill ? <View style={selectionFillStyles}></View> : null}

          {/* SliderPickerCursor button */}
          <SliderPickerCursor 
            maxOffset={vw(this.widthPercentage)}
            defaultValue={this.defaultValue}
            triggerNonDraggablePress={this.state.triggerNonDraggablePress}
            nonDraggablePressLocation={this.state.nonDraggablePressLocation}
            releaseCallback={(value) => this.handleChildRelease(value)}
            buttonBackgroundColor={this.buttonBackgroundColor}
            buttonBorderColor={this.buttonBorderColor}
            buttonBorderWidth={this.buttonBorderWidth}
            buttonDimensionsPercentage={this.buttonDimensionsPercentage}
            buttonStylesOverride={this.buttonStylesOverride}
            maxValue={this.maxValue}
            slideBeginCallback={() => this.slideBeginCallback()}
            errorToleranceMargin={this.errorToleranceMargin}
          />
        </View>
  
        { /* Lines between the numbers */ }
        {this.generateSeparators()}
  
        { /* Buttons for picking a value */ }
        {this.generateNumbers()}

      </TouchableOpacity>
    )
  }

  /** 
   * On componentDidMount()
   * - Check if user's device has screen reader enabled.
   * - If it does check if component should be convereted to a numeric input.
   */
  componentDidMount = async () => {
    // Determine if user is using a screen reader
    let screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled()

    this.setState({ screenReaderEnabled });
  }

  /** 
   * Handler function called on value change of TextInput component for screen reader enabled. Updates value of this.state.numericInputValue and makes sure it is not greater than 10.
   * @param {String} val - Value of TextInput component.
   * @return {null} Updates local state
   */
  handleNumericInputChange = (val) => {
    // Flag to determine if callback has already been called by end of function.
    let callbackExecuted = false;

    this.setState({ numericInputValue: val }, () => {
      // Make sure value isn't greater than this.maxValue
      if (Number(this.state.numericInputValue) > this.maxValue) {
        this.setState({ 
          numericInputValue: String(this.maxValue)
        }, () => {
          this.callback(this.state.numericInputValue);
          // Flip callback flag
          callbackExecuted = true;
        });
      }
      // Make sure value isn't less than this.minValue
      else if (Number(this.state.numericInputValue) < this.minValue) {
        this.setState({ 
          numericInputValue: String(this.minValue)
        }, () => {
          this.callback(this.state.numericInputValue);
          // Flip callback flag
          callbackExecuted = true;
        });
      }

      // If callback hasn't been called already, call it
      if (!callbackExecuted) {
        this.callback(this.state.numericInputValue);
      }
    });
  }

  /** 
   * Adds a key/value pair to a style object if it does not already have a value for key passed.
   * @return {null}
   */
  styleChecker = (styleObject, key, value) => {
    // If current style object doesn't include key passed
    if ( !Object.keys(styleObject).includes(key) ) {
      // Update it to value passed
      styleObject[key] = value;
    }
  }

  /** 
   * Helper method to call any other styling-related helper methods that must be called before component is rendered. 
   * @return {null}
   */
  setPreRenderStyles = () => {
    this.setLabelAndLabelContainerStyles();
    this.filterSliderInnerBorderStyles();
  }

  /** 
   * Helper method to set to set styles on labels and container and labels depending on props.
   * @return {null}
   */
  setLabelAndLabelContainerStyles = () => {
    // If handleLabelCheck() returns true, 
    // add extra bottom padding to labelsContainerStyles to account for elements lack of height.
    if (this.handleLabelCheck()) {
      this.labelsContainerStyles['paddingBottom'] = vh(5);
    }

    // Set width according to props.widthPercentage + 1
    this.labelsContainerStyles['width'] = vw((this.widthPercentage) + 1);

    // Set label styles
    this.labelStyles['color'] = this.labelFontColor;
    this.labelStyles['fontSize'] = this.labelFontSize;
    this.labelStyles['fontWeight'] = this.labelFontWeight;
  }

  /** 
   * Helper method to filter out any key/value pairs from sliderInnerBorderStyles that are not for a component's border.
   * @return {null}
   */
  filterSliderInnerBorderStyles = () => {
    // Get all keys in style object
    let keys = Object.keys(this.sliderInnerBorderStyles);

    // Loop through keys
    for (let i = 0; i < keys.length; i++) {
      // If key doesn't include "border"
      if (!(keys[i].includes('border'))) {
        // Delete it from the object
        delete this.sliderInnerBorderStyles[keys[i]];
      }
    }
  }

  /** 
   * Helper method to determine whether or not valued passed to props.defaultValue is a Number and within the range of the slider scale.
   * @param {Number} value - The value passed to props.defaultValue
   * @return {Boolean} Returns true if props.defaultValue is valid, false if not valid.
   */
  defaultValueCheckHandler = (value) => {
    // If value passed is not a number or if it's out of range.
    if (isNaN(value) || value > this.maxValue || value < 0) {
      // Set to default
      return false;
    }
    // Otherwise return value passed.
    return true;
  }

  /** 
   * Helper method to set styles for each separator. Called in this.separatorGenerator()
   * @param {Number} index - The index of event target.
   * @return {Number} Returns new width of selectionFill based on this.state.currentValue
   */
  handleSeparatorStyle = (index) => {
    // If index is 0 or this.maxValue, or if separator is for currently active set border 
    // to transparent so it's not visible
    if (index === 0 || index === this.maxValue || index === this.state.currentValue) {
      return { borderLeftColor: 'transparent' };
    }

    let separatorStyles = this.separatorStylesOverride ?
      Object.assign({}, this.separatorStylesOverride) : 
      Object.assign({}, styles.separatorLine);

    // Adjust height of separators to three times the height of the slider
    this.styleChecker(separatorStyles, 'height', vh(this.heightPercentage) * 3);

    return separatorStyles;
  }

  /** 
   * Helper function to check if none of the label props were passed. Used in render() to determine if styles.labelsContainer needs to be modified programmatically.
   * @return {Boolean} Returns true is no label props were passed, returns false otherwise
   */
  handleLabelCheck = () => {
  if  (this.minLabel === this.emptyLabel && 
        this.midLabel === this.emptyLabel &&
        this.maxLabel === this.emptyLabel
    ) {
      return true;
    }
    return false;
  }

  /** 
   * Helper method to format width of selectionFill.
   * @return {Number} Returns new width of selectionFill based on currentValue
   */
  handleSelectionFillWidth = () => {
    return (vw(this.widthPercentage) * (this.state.currentValue / (this.maxValue) )) - (vh(1) * .5);
  }

  /** 
   * Handler for press of <Slider> outside of the <Draggable> component. Updates state variables passed to <Draggable> to trigger a re-render of that component in its componentDidUpdate().
   * @param {Number} locationX - Location on x-axis where touch event took place/where used pressed along <Slider>.
   * @return {Function} Executes state updaters for draggablePressLocation and triggerNonDraggablePress
   */
  handleWrapperPress = (locationX) => {
    this.setState({
      nonDraggablePressLocation: locationX,
      triggerNonDraggablePress: true
    });
  }

  /** 
   * Handler for when user's gesture ends in <Draggable>'s panResponder instance (when they release the visual "button"). Fetches nearest value to release in <Draggable> and hoists that value to use as state in <Slider> to update state-dependent styles. Executes props.callback passed to <Slider>, and updates state.triggerNonDraggablePress which trickles down to <Draggable>.
   * @param {Number} locationX - Location on x-axis where touch event took place/where used pressed along <Slider>.
   * @return {Function} Executes props.callback and state updaters for both currentValue and triggerNonDraggablePress.
   */
  handleChildRelease = (value) => {
    this.setState({
      currentValue: value,
      triggerNonDraggablePress: false
    }, () => this.callback(value));
  }

  /** 
   * Helper method to format a styled label Text component
   * @param {String} text - The text to be displayed in Text component
   * @param {String} align - The value to set textAlign of component to 
   * @return {Component} Returns a styled Text component
   */
  labelGenerator = (text, align) => {
    return (
      <Text style={[this.labelStyles, { textAlign: align }]}>
        {text}
      </Text>
    )
  }

  /** 
   * Helper method to generate separators layered underneath the sliderContainer
   * @param {Number} index - The index of event target.
   * @return {Component} View component with nested Text component
   */
  separatorGenerator = (index) => {
    return (
      <View key={index} style={this.handleSeparatorStyle(index)}>
        <Text style={{ color: 'transparent'}}>|</Text> 
      </View>
    );
  }

  /** 
   * If props.showSeparatorScale is true, calls this.separatorGenerator() for props.maxValue times. Pushes these into an array and returns array wrapped in a View component.
   * @return {Component} View component with nested View separators
   */
  generateSeparators = () => {
    // Don't return anything if props.showSeparatorScale is false.
    if (!this.showSeparatorScale) {
      return null;
    }

    // Initialize empty array to push separators and number push buttons into below
    let separators = [];

    // For 0 through this.maxValue, push a styled separator into separators array via helper
    // method, this.separatorGenerator(). Will be rendered in JSX below.
    for (let i = 0; i <= this.maxValue; i++) {
      separators.push(this.separatorGenerator(i));
    }

    // Set width of separator container
    let separatorContainerStyles = Object.assign({}, styles.separatorContainer);
    separatorContainerStyles['width'] = vw(this.widthPercentage);

    // Set bottom property. Container is relatively positioned.
    separatorContainerStyles['bottom'] = vh(this.heightPercentage) * 2;

    return (
      <View style={separatorContainerStyles}>
        {separators}
      </View>
    )
  }

  /** 
   * If props.showNumberScale is true, generates a TouchableHighlight for each number in slider's range.
   * @return {Component} View component with nested View separators
   */
  generateNumbers = () => {
    // Don't return anything if props.showNumberScale is false.
    if (!this.showNumberScale) {
      return null;
    }

    // Make copy of styles.buttonNumber to modify programmatically
    let numberStyle = this.numberStylesOverride ?
      Object.assign({}, this.numberStylesOverride) :
      Object.assign({}, styles.buttonNumber);

    // Set numberStyle properties based on respective props
    this.styleChecker(numberStyle, 'color', this.scaleNumberFontColor);
    this.styleChecker(numberStyle, 'fontSize', this.scaleNumberFontSize);
    this.styleChecker(numberStyle, 'fontWeight', this.scaleNumberFontWeight);

    // Initialize empty array to push numbers into
    let numbers = [];

    // For 0 through this.maxValue, push a styled button into numbers. 
    // Will be rendered in JSX below.
    for (let i = 0; i <= this.maxValue; i++) {

      // Initialize width variable to set the width of each TouchableHighlight.
      // Default value is the rounded down - numbersContainers width divided by this.maxValue - 0 (number of options).
      let width = Math.floor(vw(this.widthPercentage) / (this.maxValue));
      
      // If first TouchableHighlight, add extra width to account for the width of separatorLine.
      width = i === 0 ? width + ((vw(1) / 3) * 2) : width;

      // Push styled TouchableHighlight
      numbers.push(
        <TouchableHighlight 
          key={i}
          style={[styles.buttonTouchable, { width: width }]} // Add width here
        >
          <Text style={numberStyle}>{i}</Text>
        </TouchableHighlight>
      )
    }

    // Set width of number container
    let numberContainerStyles = Object.assign({}, styles.numberContainer);
    numberContainerStyles['width'] = vw(this.widthPercentage);

    // If no separators are being displayed,
    if (!this.showSeparatorScale) {
      // Add some top margin to account for spacing
      numberContainerStyles['marginTop'] = this.scaleNumberFontSize * .75;
    }

    return (
      <View style={numberContainerStyles}>
        {numbers}
      </View>
    )
  }
}

//------------------------------------------------------------------------------
// Local Styles
//------------------------------------------------------------------------------
const styles = StyleSheet.create({
  //
  // Component level wrapper. TouchableOpacity component
  //
  wrapper: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  //
  // Container for labels. (View component)
  //
  labelsContainer: { 
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    paddingBottom: vw(6) // For when there is at least one label passed (this will be changed to vh(5) if no labels passed)
  },
  //
  // Label text (Text component)
  //
  label: {
    flex: 1,
  },
  //
  // Inner container of slider, acts as "track" for slider cursor. (View component)
  //
  sliderInner: {
    justifyContent: 'center',
    height: vh(1),
    zIndex: 20,
  },
  //
  // Container for separator lines, layered behind the sliderContainer. View component
  //
  separatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative'
  },
  //
  // Lines separating each "section" of the slider. View components.
  //
  separatorLine: {
    borderLeftWidth: vw(1) / 3,
    borderLeftColor: 'gainsboro',
    left: vw(1) / 3,
    position: 'relative',
  },
  //
  // The styled indication bar. Width is dependent on currently-picked value. View component
  //
  selectionFill: {
    borderRadius: 50,
    height: vw(2) * .65,
    position: 'absolute',
  },  
  //
  // Container for numbers. View component
  //
  numberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: vh(2),
    ... Platform.select({
      ios: {
        zIndex: 10
      }
    })
  },
  //
  // Each number button's container. TouchableHighlight component.
  //
  buttonTouchable: {
    alignItems: 'center',
    zIndex: 20,
    left: -(vw(1) / 3),
    borderWidth: 1,
    borderColor: 'transparent'
  },
  //
  // Text of button number. Text component
  //
  buttonNumber: {
    color: 'dimgray',
  },
  //
  // View component. Styling for the wrapper of the numeric TextInput when it's empty.
  //
  noText: {
    width: vw(25),
    flexDirection: 'row',
    backgroundColor: '#f1f4f5',
    borderBottomColor: "#889cb2",
    borderBottomWidth: vh(1) / 3,
    marginHorizontal: vw(5),
    marginVertical: vh(2),
    padding: vw(4),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ... Platform.isPad ? ({
      marginTop: vh(4)
    }) : null
  },
  //
  // View component. Wrapper for numeric TextInput
  //
  validatedText: {
    width: vw(25),
    flexDirection: 'row',
    backgroundColor: '#f1f4f5',
    borderBottomColor: 'green',
    borderBottomWidth: vh(1) / 3,
    marginHorizontal: vw(5),
    marginVertical: vh(2),
    padding: vw(4),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ... Platform.isPad ? ({
      marginTop: vh(4)
    }) : null
  },
  //
  // TextInput component. Numeric input for screen readers enabled.
  //
  numberTextInput: {
    flex: 1,
    fontSize: Math.ceil(vw(3) * 1.3),
    ... Platform.select({
      ios: {
        marginTop: vw(2)
      },
      android: {
        paddingBottom: 0,
        paddingTop: 5
      }
    }),
  }
});