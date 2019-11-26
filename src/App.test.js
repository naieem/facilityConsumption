import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Filter from "./filter/filter";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

const wrapper = mount(<App />);

describe("DOM Rendering", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
describe("<App />", () => {
  it("renders One <Filter /> component", () => {
    expect(wrapper.find(Filter)).toHaveLength(1);
  });
  it("renders Three <FormControl /> component and 1 <Button />", () => {
    expect(wrapper.find(FormControl)).toHaveLength(3);
    expect(wrapper.find(Button)).toHaveLength(1);
  });
});
