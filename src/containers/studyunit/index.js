import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetch} from '@/util/request';
import StudyunitDetails from '../studyunitDetails';
import './index.scss';

const mapStateToProps = ({studyunit}) => ({
  unitId: studyunit.unitId
});
@connect(mapStateToProps)
export default class Studyunit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: [],
      cardActive: 0,
      utilList: [],
      isShowDetatils: false,
      utilDetails: [],
      utilDetail: []
    };
  }
  /**
   * @description 点击单个卡片
   */
  hanldeIitem = (item, e) => {
    e.preventDefault();
    this.setState({
      steps: item.steps,
      cardActive: item.id
    });
  }
  handleStep = (index) => {
    // const {history} = this.props;
    // history.push({
    //   pathname: '/studyunitDetails',
    //   query: {id: item.id}
    // });
    const {utilDetails, cardActive} = this.state;
    const {unitId} = this.props;
    this.setState({
      isShowDetatils: true,
      utilDetail: utilDetails[`unit5_${unitId}`][`u${unitId}0${index + 1}`]
    });
  }
  handleClose = () => {
    this.setState({
      isShowDetatils: false
    });
  }
  /**
   * @description 点击上一页
   */
  handlePrev() {
    this.props.dispatch({type: 'PREV'});
    this.setState({
      steps: [],
      cardActive: ''
    });
  }
  /**
   * @description 点击下一页
   */
  handleNext() {
    this.props.dispatch({type: 'NEXT'});
    this.setState({
      steps: [],
      cardActive: ''
    });
  }

  /**
   * @description 获取单元数据
   */
  requestStudyunit() {
    fetch('fetchStudyunit', (data) => {
      this.setState({
        utilList: data
      });
    });
  }
  requestStudyunitDetails() {
    fetch('fetchUnitDetails', data => {
      this.setState({
        utilDetails: data
      });
    });
  }
  /**
   * @description render之后执行
   */
  componentDidMount() {
    this.requestStudyunit();
    this.requestStudyunitDetails();
  }
  render() {
    const {
      steps, cardActive, utilList, isShowDetatils, utilDetail
    } = this.state;
    if (utilList.length === 0) {
      return '';
    }
    const course = utilList[this.props.unitId - 1];
    return (
      <div>
        <div className="ets-ui-wrap">
          <div className="ets-chl-nav-container">
            <div className="ets-chl-nav">
              <span className="ets-chl-current-level" data-action="toggle">
                <span className="ets-chl-current-level-course">General English:</span>
                <span className="ets-chl-current-level-name">5-Elementary</span>
                <span className="ets-chl-btn" />
              </span>
            </div>
          </div>
          <div className="ets-ui-unn">
            <div className={`ets-ui-unn-btn-prev ${course.id === 1 ? 'ets-disabled' : ''}`} onClick={this.handlePrev.bind(this)} />

            <div className={`ets-ui-unn-btn-next ${course.id === 6 ? 'ets-disabled' : ''}`} onClick={this.handleNext.bind(this)} />
            {/* 主体内容 */}
            <div className="ets-ui-unn-bd">
              {/* unit Start */}
              <div className="ets-ui-unit">
                <div className="ets-ui-unit-hd ets-cf">
                  <h1 className="ets-overflow" title="看病">
                    <strong>Unit {course.id}</strong>  <span>{course.topic}</span> </h1>
                </div>
              </div>
              {/* Locked hide start */}
              <div className="ets-ui-unit-bd ets-cf">
                <div className="ets-ui-unit-bd-content">
                  {
                    course.list.map((item, index) => (
                      <div key={item.id} className="ets-ui-lesson-container" onClick={this.hanldeIitem.bind(this, item)}>
                        <div className={`ets-ui-lesson ${item.id === cardActive ? 'ets-passed' : ''}`}>
                          <div className="ets-ui-lesson-img">
                            <img src={item.img} />
                          </div>
                          <div className="ets-ui-lesson-title"><strong>{index + 1}</strong>{item.title}</div>
                        </div>
                      </div>
                    ))
                  }
                  {/* step start */}
                  {
                    steps.length === 0 ? '' : <div className="ets-ui-step-container">
                      <div className="ets-ui-steps-wrap ets-expanded">
                        <ul className="ets-ui-steps">
                          {
                            steps.map((step, index) => (
                              <li key={index} className="ets-ui-step-bd">
                                <div className="ets-ui-step ets-passed" onClick={this.handleStep.bind(this, index)}>
                                  <div className="ets-ui-step-index">{index + 1}</div>
                                  <div className="ets-ui-step-type ets-overflow">{step.title}</div>
                                  <div className="ets-ui-step-title ets-overflow">{step.contain}</div>
                                </div>
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    </div>
                  }
                  {/* step end */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          isShowDetatils ? <StudyunitDetails data={utilDetail} handleClose={this.handleClose} /> : ''
        }

      </div>
    );
  }
}
