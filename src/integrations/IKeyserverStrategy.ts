export interface IKeyserverStrategy {
    nome: string; 
    
    buscar(email: string): Promise<string | null>; 
}