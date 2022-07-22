import React from "react";
import Icons from "../../assets/img/icons/icons.svg"; // Path to your icons.svg
import PropTypes from 'prop-types';

const Icon = ({ name, color, size, classes }) => (
  <svg className={`icon icon-${name} ${classes}`} fill={color} width={size} height={size}>
    <use xlinkHref={`${Icons}#icon-${name}`} />
  </svg>
);

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number
};

export default Icon;