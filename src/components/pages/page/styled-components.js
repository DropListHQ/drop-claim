import styled from 'styled-components';

export const Page = styled.div`
  display: flex;
  height: 100%;
  background-color: ${props => props.theme.primaryColor};
`;


export const MainContent = styled.div`
	flex: 1;
  
`;

export const Content = styled.main`
  padding: 24px 20px 0;
`
