import { BigNumber } from '@0xproject/utils';
import * as _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { AddressInput } from 'ts/components/inputs/address_input';
import { TokenAmountInput } from 'ts/components/inputs/token_amount_input';
import { Token, TokenState } from 'ts/types';

interface SendDialogProps {
	onComplete: (recipient: string, value: BigNumber) => void;
	onCancelled: () => void;
	isOpen: boolean;
	token: Token;
	tokenState: TokenState;
}

interface SendDialogState {
	value?: BigNumber;
	recipient: string;
	shouldShowIncompleteErrs: boolean;
	isAmountValid: boolean;
}

export class SendDialog extends React.Component<SendDialogProps, SendDialogState> {
	constructor() {
		super();
		this.state = {
			recipient: '',
			shouldShowIncompleteErrs: false,
			isAmountValid: false,
		};
	}
	public render() {
		const transferDialogActions = [
			<FlatButton key="cancelTransfer" label="Cancel" onTouchTap={this._onCancel.bind(this)} />,
			<FlatButton
				key="sendTransfer"
				disabled={this._hasErrors()}
				label="Send"
				primary={true}
				onTouchTap={this._onSendClick.bind(this)}
			/>,
		];
		return (
			<Dialog
				title="I want to send"
				titleStyle={{ fontWeight: 100 }}
				actions={transferDialogActions}
				open={this.props.isOpen}
			>
				{this._renderSendDialogBody()}
			</Dialog>
		);
	}
	private _renderSendDialogBody() {
		return (
			<div className="mx-auto" style={{ maxWidth: 300 }}>
				<div style={{ height: 80 }}>
					<AddressInput
						initialAddress={this.state.recipient}
						updateAddress={this._onRecipientChange.bind(this)}
						isRequired={true}
						label={'Recipient address'}
						hintText={'Address'}
					/>
				</div>
				<TokenAmountInput
					label="Amount to send"
					token={this.props.token}
					tokenState={this.props.tokenState}
					shouldShowIncompleteErrs={this.state.shouldShowIncompleteErrs}
					shouldCheckBalance={true}
					shouldCheckAllowance={false}
					onChange={this._onValueChange.bind(this)}
					amount={this.state.value}
					onVisitBalancesPageClick={this.props.onCancelled}
				/>
			</div>
		);
	}
	private _onRecipientChange(recipient?: string) {
		this.setState({
			shouldShowIncompleteErrs: false,
			recipient,
		});
	}
	private _onValueChange(isValid: boolean, amount?: BigNumber) {
		this.setState({
			isAmountValid: isValid,
			value: amount,
		});
	}
	private _onSendClick() {
		if (this._hasErrors()) {
			this.setState({
				shouldShowIncompleteErrs: true,
			});
		} else {
			const value = this.state.value;
			this.setState({
				recipient: undefined,
				value: undefined,
			});
			this.props.onComplete(this.state.recipient, value);
		}
	}
	private _onCancel() {
		this.setState({
			value: undefined,
		});
		this.props.onCancelled();
	}
	private _hasErrors() {
		return _.isUndefined(this.state.recipient) || _.isUndefined(this.state.value) || !this.state.isAmountValid;
	}
}
