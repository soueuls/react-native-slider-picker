/**
 * react-native-slider-picker - NPM Package
 *
 * @module /SliderPickerCursor
 * @description Generic pre-styled slide picker cursor. Animated component that can be dragged within it's parent.
 * @param {String} buttonBackgroundColor - Optional. Sets background color of Slider's button. Can pass valid React Native color keywords, hexidecimal, rgb(), or rgba() values. Defaults to `"white"`.
 * @param {String} buttonBorderColor - Optional. Sets border color of Slider's button. Can pass valid React Native color keywords, hexidecimal, rgb(), or rgba() values. Defaults to `"dimgrey"`.
 * @param {Number} defaultValue - Optional. Default value the cursor will be placed in <SliderPicker> on.
 * @param {Number} errorToleranceMargin - Optional. Defaults to `50` in `<SliderPicker>`. Margin of error for user to move drag off of the cursor along the Y Axis of the screen/component. If user drags beyond this amont of units in either vertical direction the PanResponder event will not update position of cursor. Is checked to ensure a `Number` type is passed that is greater than `0`.
 * @param {Number} maxOffset - Optional. X-axis coordinates of right-edge of <SliderPicker>. Component cannot be draggeed right past this point.
 * @param {Number} nonDraggablePressLocation - X-axis location of user press within <SliderPicker>. Combined with triggerNonDraggablePress, determines whether or not handler function should be called for user presses within the parent component. 
 * @param {Function} releaseCallback - Optional. Called when touch/gesture of component ends either by user releasing their finger, the panResponder event being terminated by the user's touch leaving the component, or when the user presses within the parent component.
 * @param {Function} slideBeginCallback  - Optional. Callback function to be executed when Slider's touch event begins. Called in `onPanResponderGrant` property of the component's `panResponder`. Defaults to `() => {}`.
 * @param {Boolean} triggerNonDraggablePress - Combined with nonDraggablePressLocation, determines whether or not handler function should be called for user presses within the parent component.
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React, { Component } from "react";
import { Animated, PanResponder } from "react-native";
import { vh, vw } from 'react-native-css-vh-vw';

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
export class SliderPickerCursor extends Component {
  constructor(props) {
    super(props);

    // Props checking
    this.buttonBackgroundColor =  this.props.buttonBackgroundColor ? this.props.buttonBackgroundColor : 'white';
    this.buttonBorderColor =  this.props.buttonBorderColor ? this.props.buttonBorderColor : 'dimgrey';
    this.buttonBorderWidth = this.props.buttonBorderWidth ? this.props.buttonBorderWidth : 1;
    this.buttonDimensionsPercentage = this.props.buttonDimensionsPercentage ? this.props.buttonDimensionsPercentage : 6;
    this.defaultValue = this.props.defaultValue;
    this.maxOffset = this.props.maxOffset ? this.props.maxOffset : vw(85);
    this.maxValue = this.props.maxValue ?  this.props.maxValue : 10;
    this.releaseCallback = this.props.releaseCallback ? this.props.releaseCallback : () => {};
    this.slideBeginCallback = this.props.slideBeginCallback ? this.props.slideBeginCallback : () => {};
    this.errorToleranceMargin = this.props.errorToleranceMargin ? this.props.errorToleranceMargin : null;

    // Check override style props
    this.buttonStylesOverride = this.props.buttonStylesOverride ? this.props.buttonStylesOverride : null;

    // Set buttonWidth to width passed for dimensions by default
    this.buttonWidth = vw(this.buttonDimensionsPercentage);

    // If button styles have been override and the override styles have a width property
    if ( this.buttonStylesOverride && Object.keys(this.buttonStylesOverride).includes('width') ) {
      // Set buttonWidth to the value passed in styles override.
      this.buttonWidth = this.buttonStylesOverride['width'];
    }

    // Make sure that defaultValue isn't out of range
    if (this.defaultValue > this.maxValue) {
      this.defaultValue = this.maxValue;
    }
    
    // Initialize empty array to store xOffsets in
    this.offsetsMap = [];

    // Get x-axis positioning of each number/separator
    for (let i = 0; i <= this.maxValue; i++) {
      this.offsetsMap.push({
        offset: this.maxOffset * (i / this.maxValue),
        value: i
      });
    }

    // Initialize state
    this.state = {
      // Create instance of Animated.XY, which interpolates X and Y values, in our case, we'll only need the X value.
      drag: new Animated.ValueXY(),
      // used to reference latestPosition of draggable view. Updated onPanResponderRelease.
      latestPosition: this.getOffsetPosition(this.defaultValue),
      // Used to set state on drag if user drags past Y axis threshold.
      xOffsetAtToleranceMarginSurpassed: null
    };

    // Initialize value to accomodate for width of button
    this.state.drag.setValue({ 
      x: this.getOffsetPosition(this.defaultValue) - (this.buttonWidth * .5),
      y: 0 
    });

    // Create panResponder, which is responsible for the dragging
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder : () => true,
      onPanResponderGrant: (evt, gesture) => {
        this.panResponderGrantHandler()
      },
      onPanResponderMove: (evt, gesture) => { // When user moves cursor/button
        this.panResponderMoveHandler(gesture);
      },
      onPanResponderRelease: (evt, gesture) => { // When user press/drag ends
        this.panResponderReleaseHandler(gesture)
      },
      onPanResponderTerminate: (evt, gesture) => { // When user's touch/gesture is move outside of the button/cursor of <SliderPickerCursor>
        this.panResponderReleaseHandler(gesture);
      }
    });
  }

  /**
   * Render
   */
  render() {

    //
    // Set dynamic styles based on props
    //

    // Initialize circle styles
    let circleStyles = this.buttonStylesOverride ? Object.assign({}, this.buttonStylesOverride) : {};
    
    // Set color and border width
    this.styleChecker(circleStyles, 'backgroundColor', this.buttonBackgroundColor);
    this.styleChecker(circleStyles, 'borderColor', this.buttonBorderColor);
    this.styleChecker(circleStyles, 'borderWidth', this.buttonBorderWidth);

    // Set dimensions and shape
    this.styleChecker(circleStyles, 'height', vw(this.buttonDimensionsPercentage));
    this.styleChecker(circleStyles, 'width', vw(this.buttonDimensionsPercentage));
    this.styleChecker(circleStyles, 'borderRadius', vw(this.buttonDimensionsPercentage) * .5);

    return (
      <Animated.View 
        {...this._panResponder.panHandlers} // Add _panResponder's handlers to component
        style={[this.state.drag.getLayout(), circleStyles]} // Include layout from this.state.drag in styles
      >     
      </Animated.View>
    )
  }

  /** 
   * On componentDidUpdate:
   * If previous props for triggerNonDraggablePressLocation and nonDraggablePressLocation are not equal to current props (user has pressed the component outside of <SliderPickerCursor> and triggered an event), execute the nonDraggablePressHandler.
   */
  componentDidUpdate(prevProps) {
    // If user triggered a button press and we have x location of event
    if (prevProps.triggerNonDraggablePress !== this.props.triggerNonDraggablePress &&
        prevProps.nonDraggablePressLocation !== this.props.nonDraggablePressLocation) {
      this.nonDraggablePressHandler(this.props.nonDraggablePressLocation);
    }
  }
  
  /** 
   * Event handler for when panResponder gesture has started. Sets x offset and x/y value of drag panResponder instance.
   * @return {Function} Executes this.state.drag.setOffset and this.state.drag.setValue.
   */
  panResponderGrantHandler = () => {
    this.props.slideBeginCallback();
    // Set offset state.drag to prevent Animated.View from returning to 0 coordinates 
    // when it is moved again.
    this.state.drag.setOffset({x: this.state.drag.x._value, y: this.state.drag.y._value});
    // Set value to 0/0 to prevent AnimatedView from "jumping" on start of drag. Stabilizes the component.
    this.state.drag.setValue({x: 0, y: 0})
  }

  /** 
   * Event handler for when panResponder moves. Calculates final x-location of drag instance based on sum of gesture distance moved and the most recent position of the <SliderPickerCursor> component within the <Slider>.
   * @param {Object} gesture - The gestureState object passed as a param to each panResponder callback.
   * @return {Function} Executes this.state.drag.setValue to update x value if sum of gesture change and this.state.latestPosition is within the bounds of the <Slider>.
   */
  panResponderMoveHandler = (gesture) => {
    // Get the final value that user has dragged to.
    let finalValue = gesture.dx + this.state.latestPosition;

    // If user has dragged past the yAxis threshold, cancel event
    if (this.errorToleranceMargin && 
        (gesture.dy > this.errorToleranceMargin || gesture.dy < (this.errorToleranceMargin * -1) )) {
      // If there isn't already a value in state for xOffsetAtToleranceMarginSurpassed
      if (!this.state.xOffsetAtToleranceMarginSurpassed) {
        // Set value in state
        this.setState({ xOffsetAtToleranceMarginSurpassed: gesture.dx });
      }
      // End function
      return null;
    }
    
    // If finalValue is in of slider, update state.drag to appropriate position
    if (finalValue >= 0 && finalValue <= (this.maxOffset) ) {
      // If there was value set when user dragged out of bounds vertically
      if (this.state.xOffsetAtToleranceMarginSurpassed) {
        // Clear that value in state
        this.setState({ xOffsetAtToleranceMarginSurpassed: null });
      }
      this.state.drag.setValue({ x: gesture.dx, y: 0 });
    }
  }

  /** 
   * Get offset value for start position based on value of this.defaultValue.
   * @param {Number} defaultValue - Value of this.defaultValue, number where it should 
   * @return {Number} offset value to be set in constructors set in x key of this.state.drag.setValue()
   */
  getOffsetPosition = (value) => {
    let nearest = this.offsetsMap.filter(obj => {
      return obj.value === value;
    });

    return nearest[0].offset;
  }

  /** 
   * Event handler for when panResponder touch event ends. Calculates final x-location of drag instance based on sum of gesture distance moved and the most recent position of the <SliderPickerCursor> component within the <Slider>. Executes callbacks to update state accordingly.
   * @param {Object} gesture - The gestureState object passed as a param to each panResponder callback.
   * @return {Function} Exectues props.releaseCallback(), this.state.drag.setValue(), updates this.state.latestPosition, and this.state.drag.flattenOffset(). 
   */
  panResponderReleaseHandler = (gesture) => {

    // Get the final value that user has dragged to.
    let finalValue = gesture.dx + this.state.latestPosition;

    // If touch event ended while user was passed y threshold
    if (this.state.xOffsetAtToleranceMarginSurpassed) {
      // Update value to that of state.xOffsetAtYThreshould + state.latestPosition
      finalValue = this.state.xOffsetAtToleranceMarginSurpassed + this.state.latestPosition;
      // Clear value for xOffsetAtToleranceMarginSurpassed
      this.setState({ xOffsetAtToleranceMarginSurpassed: null });
    }

    // Initialize variabels to be used in business logic and update state.
    let newPosition;
    let updatedOffsetX;

    // If in bounds
    if (finalValue >= 0 && finalValue <= this.maxOffset) {
      
      // Get number/index of nearest
      let nearestNumber = this.getNearestHandler(finalValue);
      
      // Get x-positioning of nearest number
      let nearestOffset = this.offsetsMap.filter(obj => {
        return obj.value === nearestNumber
      });

      nearestOffset = nearestOffset[0].offset;

      newPosition = nearestOffset;

      // If user returns to original position prior to this panResponder touch
      if (nearestOffset === this.state.latestPosition) {
        updatedOffsetX = 0;
      }
      // If moved to the left, subtract 
      else if (nearestOffset < this.state.latestPosition) {
        updatedOffsetX = (this.state.latestPosition - nearestOffset) * -1
      }
      // If moved to the right 
      else {
        updatedOffsetX = nearestOffset - this.state.latestPosition;
      }
    }
    // If drag is out of bounds
    else {
      // If gesture.dx is positive
      if (gesture.dx > 0) {
        // Set newPosition to maxOffset
        newPosition = this.maxOffset;
        // Set value to update offset x with to maxOffset - latestPosition
        updatedOffsetX = this.maxOffset - this.state.latestPosition;
      }
      // If gesture.dx is the same or negative 
      else {
        // Set newPosition to 0
        newPosition = 0;
        // Set value to update offset x with to negative value of latestPosition
        updatedOffsetX = this.state.latestPosition * -1;
      }
    }

    // Execute props callback to lift state to <Slider>
    this.releaseCallback(this.getNearestHandler(finalValue));

    // Move component to nearest 
    this.state.drag.setValue({ x: updatedOffsetX, y: 0 });

    // Update latestPosition
    this.setState({ latestPosition: newPosition });

    // Flatten offset on release to prevent bug on repeated drags
    this.state.drag.flattenOffset();
  }

  /** 
   * Handler function when the parent <Slider> component is pressed anywhere outside of the <SliderPickerCursor> component. Get's nearest number and offset of the touch event's x-axis coordinates, moves the button to the appropriate spot in the <Slider>, updates state locally and hoists state up to <Slider> to display purposes.
   * @param {Number} locationX - The value of nativeEvent.locationX where <Slider> component is pressed.
   * @return {Function} Exectues props.releaseCallback(), this.state.drag.setValue(), updates this.state.latestPosition, and this.state.drag.flattenOffset(). 
   */
  nonDraggablePressHandler = (locationX) => {
    // Get number/index of nearest
    let nearestNumber = this.getNearestHandler(locationX);
    
    // Get x-positioning of nearest number
    let nearestOffset = this.offsetsMap.filter(obj => {
      return obj.value === nearestNumber
    });

    nearestOffset = nearestOffset[0].offset;

    // Execute props callback to lift state to <Slider>
    this.releaseCallback(nearestNumber);

    // Move component to nearest (accommodate for width of component itself).
    this.state.drag.setValue({ x: nearestOffset - (this.buttonWidth * .5), y: 0 });

    // Update latestPosition
    this.setState({ latestPosition: nearestOffset });

    // Flatten offset on release to prevent bug on repeated drags
    this.state.drag.flattenOffset();
  }

  /** 
   * Helper function to get the nearest x-offset/number of component. Called on panHandlerRelease
   * @param {Number} value - The x-coordinates within the Slider component the button is at at time of function call.
   * @return {Number} Number on scale that button is closest to.
   */
  getNearestHandler = (value) => {  
    // If value is out of bounds, set either to 0 or maxValue
    if (value >= this.maxOffset) {
      return this.offsetsMap[this.offsetsMap.length - 1].value;
    }
    else if (value <= 0) {
      return 0;
    }

    // Get nearest value from array of xOffsets
    const nearest = this.offsetsMap.reduce((prev, curr) => Math.abs(curr.offset - value) < Math.abs(prev.offset - value) ? curr : prev);
    
    return nearest.value;
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
}