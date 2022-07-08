import * as React from "react";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

//Material UI had a version. I customized it 
//to match the requirement for the exercise

//I also added dynamic length in case different screener has more/ less questions
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 45 }}>
        <Typography variant="h6" color="text.secondary">
          {`${props.progress} of ${props.length}`} 
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired
};

const ProgressBar = ({ currentQuestion, qLength }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel 
        value={(currentQuestion / 8) * 100} 
        progress={currentQuestion}
        length={qLength}
      />
    </Box>
  );
}

export default ProgressBar;