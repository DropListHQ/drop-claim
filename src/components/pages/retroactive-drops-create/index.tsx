import React, { useState, FC } from 'react'

import { useHistory } from 'react-router-dom'
import {
  WidgetInput,
  WidgetTextarea,
  WidgetControls,
  WidgetButton,
  WidgetDataSplit,
  WidgetDataBlock
} from './styled-compoents'

import { TDropStep } from 'types'
import { RootState } from 'data/store';
import { DropActions } from 'data/store/reducers/drop/types'
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as dropActions from 'data/store/reducers/drop/actions'


const mapStateToProps = ({
  user: { address, provider, chainId },
  drop: { step },
}: RootState) => ({
  address,
  step,
  provider,
  chainId,
})

const mapDispatcherToProps = (dispatch: Dispatch<DropActions>) => {
  return {
      setStep: (step: TDropStep) => dispatch(dropActions.setStep(step))
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const RetroactiveDropsCreate: FC<ReduxType> = ({
  address,
  provider,
  step
}) => {

  return <div>
    Hello
  </div>
}

export default connect(mapStateToProps, mapDispatcherToProps)(RetroactiveDropsCreate)
