// NPM Dependencies
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import QRCode from 'qrcode.react';

// UI Dependencies
import { Button, Form, Spin, Icon, Input } from 'antd';

// Util Dependencies
import Emoji from 'utils/components/emoji';

// Local Dependencies
import { redeemGiftSignal } from '../actions';

class RedeemForm extends Component {
    static propTypes = {
        form: PropTypes.shape({
            getFieldDecorator: PropTypes.func.isRequired,
            validateFields: PropTypes.func.isRequired
        }).isRequired,
        redeemGift: PropTypes.func.isRequired,
        giftDetails: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    // componentDidUpdate = (prevProps) => {
    //     if (this.props.invoiceStatus !== prevProps.invoiceStatus) {
    //         this.setState({
    //             loading: false
    //         });
    //     }
    // };

    handleSubmit = (e) => {
        e.preventDefault();
        const { form, redeemGift, giftDetails } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                const { address } = values;

                redeemGift({ address, orderId: giftDetails.orderId });

                this.setState({
                    loading: true
                });
            }
        });
    };

    validateInvoice = (rule, value, callback) => {
        // if (!_.isNumber(value)) {
        //     callback('Please enter numbers only');
        // } else {
        //     callback();
        // }
        callback();
    };

    render() {
        const { loading } = this.state;
        const { getFieldDecorator } = this.props.form;

        if (loading) {
            return (
                <div style={{ textAlign: 'center' }}>
                    <Spin tip="loading..." size="large" />
                </div>
            );
        }

        return (
            <Fragment>
                <Form onSubmit={this.handleSubmit} layout="vertical" hideRequiredMark style={{ textAlign: 'center' }}>
                    <Form.Item>
                        {getFieldDecorator('amount', {
                            rules: [{ validator: this.validateAmount }]
                        })(
                            <Input
                                style={{ width: '100%' }}
                                placeholder="Gift amount (satoshi)"
                                size="large"
                                addonAfter="sats"
                                min={1}
                            />
                        )}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" size="large" style={{ width: '100%' }} htmlType="submit">
                            Receive gift
                        </Button>
                    </Form.Item>
                </Form>
            </Fragment>
        );
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators({
        redeemGift: redeemGiftSignal.request
    }, dispatch);


const WrappedRedeemForm = Form.create()(RedeemForm);

export default connect(null, mapDispatchToProps)(WrappedRedeemForm);