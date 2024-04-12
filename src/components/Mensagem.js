import React from 'react';

class Mensagem extends React.Component {
    render() {
        const { sucesso, mensagem } = this.props;

        return (
            <div className={`mt-3 alert ${sucesso ? 'alert-success' : 'alert-danger'}`} role="alert">
                {mensagem}
            </div>
        );
    }
}

export default Mensagem;