export async function createLoadoutAction(input: {
  operatorId: string;
  primary: string;
  primaryAttachments: string[];
  secondary: string;
  secondaryAttachments: string[];
  gadgets: string[];
  isPublic?: boolean;
}, ctx: any) {
  if (!ctx.user) throw new Error('Authentication required');
  // validate operator exists
  const { OPERATORS } = await import('./seed');
  if (!OPERATORS.find(o => o.id === input.operatorId)) {
    throw new Error('Invalid operatorId');
  }
  const doc = {
    operatorId: input.operatorId,
    primary: input.primary,
    primaryAttachments: input.primaryAttachments || [],
    secondary: input.secondary,
    secondaryAttachments: input.secondaryAttachments || [],
    gadgets: input.gadgets || [],
    isPublic: input.isPublic ?? true,
    ownerId: ctx.user.id,
    createdAt: new Date()
  };
  // DeepSpace will handle permissions via schema
  return doc;
}
