import styled from 'styled-components';

export const Row = styled.div`
  background-color: green;
  border-radius: 5px;
  width: 45%;
  padding: 15px;
  margin: 10px auto;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  border-radius: 15px;
  background-color: rgba(256,256,256,0.3);
`;

export const TableHeader = styled(Row)`
  width: 45%
  text-decoration: underline;
  font-size: 20px;
  font-weight: 700;
`;

export const TableData = styled.div`
  width: ${props => props.artist ? "50%" : "25%"};
  margin: auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: ${props => props.heading ? "22px" : "18px"};
`;
