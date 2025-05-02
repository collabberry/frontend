import { Alert, Badge, Button, Card, FormContainer, FormItem, Input } from '@/components/ui';
import { useHandleError } from '@/services/HandleError';
import { Form, useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { handleErrorMessage, handleSuccess } from '@/components/collabberry/helpers/ToastNotifications';
import MessageSquare from '@/components/collabberry/custom-components/MessageSquare';
import { Loading } from '@/components/shared';

// const AgreementAssistant: React.FC = () => {

//     const navigate = useNavigate();
//     const handleError = useHandleError()
//     const [conversationStarted, setConversationStarted] = useState(false);
//     const [userInput, setUserInput] = useState("");
//     const [conversationHistory, setConversationHistory] = useState<
//         Array<{
//             type: "user" | "assistant";
//             content: string;
//         }>
//     >([]);
//     const [showForm, setShowForm] = useState(false);
//     const [summaryPresented, setSummaryPresented] = useState(false);
//     const [finalizeSummary, setFinalizeSummary] = useState(false);
//     const [suggestions, setSuggestions] = useState<{
//         role?: string;
//         experience?: string;
//         responsibilities?: string[];
//         marketRate?: number;
//         location?: string;
//     }>({});

//     const analyzeRoleMutation = useMutation({
//         mutationFn: async (context: {
//             status: string;
//             currentMessage: string;
//             history: Array<{ type: "user" | "assistant"; content: string }>;
//         }) => {
//             console.log("Sending analysis request:", context);
//             // Simulate an API response for demonstration purposes
//             return {
//                 analysis: "This is a simulated analysis response.",
//                 suggestedRole: "Developer",
//                 suggestedExperience: "3+ years",
//                 suggestedResponsibilities: ["Coding", "Testing"],
//                 marketRate: 5000,
//                 suggestedLocation: "Remote",
//             };
//         },
//     });

//     const createAgreementMutation = useMutation({
//         mutationFn: async (data: any) => {
//             //   const res = await apiRequest("POST", "http://localhost:3001/api/agreements", data);
//             //   return res.json();
//         },
//         onSuccess: (data) => {
//             // Invalidate the agreements query cache so the list refreshes when user goes back
//             //   queryClient.invalidateQueries({ queryKey: ["http://localhost:3001/api/agreements"] });

//             handleSuccess({
//                 title: "Agreement created",
//                 description: "Your agreement has been saved successfully.",
//             });
//             //   navigate(`/agreements/${data?.id}`);
//         },
//     });

//     const handleStartConversation = async () => {
//         console.log("Starting conversation...");
//         setConversationStarted(true);
//         setConversationHistory([
//             {
//                 type: "assistant",
//                 content:
//                     "Hi! I'd love to understand your interest. Why do you want to join the team?",
//             },
//         ]);
//     };

//     const handleSubmitMessage = async () => {
//         if (!userInput.trim()) return;

//         // Add user message to history
//         const updatedHistory = [
//             ...conversationHistory,
//             { type: "user" as const, content: userInput },
//         ];
//         setConversationHistory(updatedHistory);

//         try {
//             console.log("Analyzing message:", userInput);
//             // Get AI analysis with full conversation context
//             const analysis = await analyzeRoleMutation.mutateAsync({
//                 status: "PENDING",
//                 currentMessage: userInput,
//                 history: updatedHistory,
//             });

//             console.log("Analysis response:", analysis);

//             if (analysis?.analysis === "" && summaryPresented) {
//                 if (analysis.analysis === "" && summaryPresented) {
//                     // User has confirmed the summary, prepare to show the final form

//                     // Update suggestions state with final values from the AI
//                     const updatedSuggestions = {
//                         role: analysis.suggestedRole || suggestions.role,
//                         experience: analysis.suggestedExperience || suggestions.experience,
//                         responsibilities:
//                             analysis.suggestedResponsibilities || suggestions.responsibilities,
//                         marketRate: analysis.marketRate || suggestions.marketRate,
//                         location: analysis.suggestedLocation || suggestions.location,
//                     };
//                     setSuggestions(updatedSuggestions);

//                     // Set all form values, including hidden fields that will be submitted with the form
//                     // formik.resetForm({
//                     //   role: updatedSuggestions.role,
//                     //   experience: updatedSuggestions.experience,
//                     //   responsibilities: updatedSuggestions.responsibilities || [],
//                     //   marketRate: updatedSuggestions.marketRate || 0,
//                     //   industry: "web3", // Default industry
//                     //   commitmentLevel: 40, // Default 40 hours
//                     //   fiatAmount: 0, // Default 0, user will update
//                     //   username: "", // User will fill this out
//                     //   name: "", // Will be set from username during submission
//                     //   location: updatedSuggestions.location || "Remote", // Default to Remote if not provided
//                     // });

//                     // Log the state for debugging
//                     console.log("Setting form values:", {
//                         role: updatedSuggestions.role,
//                         experience: updatedSuggestions.experience,
//                         marketRate: updatedSuggestions.marketRate,
//                         responsibilities: updatedSuggestions.responsibilities,
//                         location: updatedSuggestions.location,
//                     });

//                     // Show form fields to the user
//                     setFinalizeSummary(true);
//                     setShowForm(true);

//                     // Force validation to run
//                     // setTimeout(() => {
//                     //   formik.trigger();
//                     // }, 100);

//                     return;
//                 }

//                 // Add AI response to history
//                 setConversationHistory((prev) => [
//                     ...prev,
//                     {
//                         type: "assistant" as const,
//                         content: analysis.analysis,
//                     },
//                 ]);

//                 // Update suggestions if provided
//                 if (
//                     analysis.suggestedRole ||
//                     analysis.suggestedExperience ||
//                     analysis.suggestedResponsibilities ||
//                     analysis.marketRate ||
//                     analysis.suggestedLocation
//                 ) {
//                     setSuggestions((prev) => ({
//                         ...prev,
//                         role: analysis.suggestedRole || prev.role,
//                         experience: analysis.suggestedExperience || prev.experience,
//                         responsibilities:
//                             analysis.suggestedResponsibilities || prev.responsibilities,
//                         marketRate: analysis.marketRate || prev.marketRate,
//                         location: analysis.suggestedLocation || prev.location,
//                     }));

//                     // If this is the first time we have all the information, mark as summary presented
//                     if (
//                         analysis.suggestedRole &&
//                         analysis.suggestedExperience &&
//                         analysis.suggestedResponsibilities &&
//                         analysis.marketRate &&
//                         analysis.suggestedLocation &&
//                         !summaryPresented
//                     ) {
//                         setSummaryPresented(true);
//                     }
//                 }
//             }
//         } catch (error) {
//             console.error("Error analyzing message:", error);
//             handleError({
//                 title: "Error",
//                 description: "Failed to analyze your message. Please try again.",
//                 variant: "destructive",
//             });
//         }

//         setUserInput("");
//     };

//     const formik = useFormik({
//         initialValues: {
//             commitmentLevel: 0 as number,
//             fiatAmount: 0 as number,
//             username: "" as string,
//         },
//         validationSchema: Yup.object({
//             commitmentLevel: Yup.number()
//                 .required("Required")
//                 .min(1, "Must be at least 1")
//                 .max(40, "Can’t exceed 40"),
//             fiatAmount: Yup.number()
//                 .required("Required")
//                 .min(1, "Must be at least $1"),
//             username: Yup.string().required("Please enter your name"),
//         }),
//         onSubmit: (values) => {
//             // enrich with suggestions & defaults
//             const payload = {
//                 ...values,
//                 name: values.username,
//                 role: suggestions.role,
//                 experience: suggestions.experience,
//                 responsibilities:
//                     suggestions.responsibilities && suggestions.responsibilities.length
//                         ? suggestions.responsibilities
//                         : [],
//                 marketRate: suggestions.marketRate,
//                 industry: "web3",
//                 location: suggestions.location || "Remote",
//             };

//             createAgreementMutation.mutate(payload);
//         },
//     });

//     return (
//         <div className="min-h-screen bg-background p-6">
//             <div className="max-w-2xl mx-auto">
//                 <Card>
//                     <div className="flex items-center gap-2">
//                         <h3>Join Collabberry</h3>
//                         <Badge className="gap-1">
//                             {/* <Bot className="h-3 w-3" /> */}
//                             AI Assisted
//                         </Badge>
//                     </div>
//                     <div>
//                         {!conversationStarted ? (
//                             <div className="space-y-4">
//                                 <Alert>
//                                     {/* <Bot className="h-4 w-4" /> */}
//                                     <div>Let's Talk About Your Contribution</div>
//                                     <div>
//                                         I'd love to learn about your experience and how you'd like
//                                         to help build Collabberry. Let's have a conversation about
//                                         your interests and find the perfect role for you within the
//                                         team.
//                                     </div>
//                                 </Alert>
//                                 <Button onClick={handleStartConversation} className="w-full">
//                                     <MessageSquare className="mr-2 h-4 w-4" />
//                                     Start Conversation
//                                 </Button>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 {/* Conversation History */}
//                                 <div className="space-y-4 mb-4">
//                                     {conversationHistory.map((message, index) => (
//                                         <div
//                                             key={index}
//                                             className={`flex gap-2 ${message.type === "user"
//                                                 ? "justify-end"
//                                                 : "justify-start"
//                                                 }`}
//                                         >
//                                             {message.type === "assistant" && (
//                                                 // <Bot className="h-6 w-6 mt-1" />
//                                                 <div className="h-6 w-6 mt-1 bg-muted rounded-full" />
//                                             )}
//                                             <div
//                                                 className={`rounded-lg p-3 max-w-[80%] ${message.type === "user"
//                                                     ? "bg-primary text-primary-foreground ml-auto"
//                                                     : "bg-muted"
//                                                     }`}
//                                                 dangerouslySetInnerHTML={{
//                                                     __html: message.content.replace(/\n/g, "<br/>"),
//                                                 }}
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {summaryPresented && !finalizeSummary && (
//                                     <div className="flex gap-2 pb-4">
//                                         <Button
//                                             variant="default"
//                                             className="flex-1"
//                                             onClick={async () => {
//                                                 setUserInput(
//                                                     "Looks good to me. I accept this summary.",
//                                                 );

//                                                 const message =
//                                                     "Looks good to me. I accept this summary.";

//                                                 const updatedHistory = [
//                                                     ...conversationHistory,
//                                                     { type: "user" as const, content: message },
//                                                 ];
//                                                 setConversationHistory(updatedHistory);

//                                                 try {
//                                                     console.log(
//                                                         "Automatically sending acceptance message",
//                                                     );
//                                                     // Get AI analysis with full conversation context
//                                                     const analysis =
//                                                         await analyzeRoleMutation.mutateAsync({
//                                                             status: "FINAL",
//                                                             currentMessage: message,
//                                                             history: updatedHistory,
//                                                         });

//                                                     console.log(
//                                                         "Analysis response for automatic acceptance:",
//                                                         analysis,
//                                                     );

//                                                     if (analysis.analysis === "" && summaryPresented) {
//                                                         const updatedSuggestions = {
//                                                             role: analysis.suggestedRole || suggestions.role,
//                                                             experience:
//                                                                 analysis.suggestedExperience ||
//                                                                 suggestions.experience,
//                                                             responsibilities:
//                                                                 analysis.suggestedResponsibilities ||
//                                                                 suggestions.responsibilities,
//                                                             marketRate:
//                                                                 analysis.marketRate || suggestions.marketRate,
//                                                             location:
//                                                                 analysis.suggestedLocation ||
//                                                                 suggestions.location,
//                                                         };
//                                                         setSuggestions(updatedSuggestions);

//                                                         // Set form values
//                                                         formik.resetForm({
//                                                             role: updatedSuggestions.role,
//                                                             experience: updatedSuggestions.experience,
//                                                             responsibilities:
//                                                                 updatedSuggestions.responsibilities || [],
//                                                             marketRate: updatedSuggestions.marketRate || 0,
//                                                             industry: "web3",
//                                                             commitmentLevel: 40,
//                                                             fiatAmount: 0,
//                                                             username: "",
//                                                             name: "",
//                                                             location: updatedSuggestions.location || "Remote",
//                                                         });

//                                                         setFinalizeSummary(true);
//                                                         setShowForm(true);

//                                                         // Force validation to run
//                                                         // setTimeout(() => {
//                                                         //     form.trigger();
//                                                         // }, 100);

//                                                         return;
//                                                     }

//                                                     // Add AI response to history if there is one
//                                                     if (analysis.analysis) {
//                                                         setConversationHistory((prev) => [
//                                                             ...prev,
//                                                             {
//                                                                 type: "assistant" as const,
//                                                                 content: analysis.analysis,
//                                                             },
//                                                         ]);
//                                                     }

//                                                     // Update suggestions if provided
//                                                     if (
//                                                         analysis.suggestedRole ||
//                                                         analysis.suggestedExperience ||
//                                                         analysis.suggestedResponsibilities ||
//                                                         analysis.marketRate ||
//                                                         analysis.suggestedLocation
//                                                     ) {
//                                                         setSuggestions((prev) => ({
//                                                             ...prev,
//                                                             role: analysis.suggestedRole || prev.role,
//                                                             experience:
//                                                                 analysis.suggestedExperience || prev.experience,
//                                                             responsibilities:
//                                                                 analysis.suggestedResponsibilities ||
//                                                                 prev.responsibilities,
//                                                             marketRate:
//                                                                 analysis.marketRate || prev.marketRate,
//                                                             location:
//                                                                 analysis.suggestedLocation || prev.location,
//                                                         }));
//                                                     }
//                                                 } catch (error) {
//                                                     console.error(
//                                                         "Error processing automatic acceptance:",
//                                                         error,
//                                                     );
//                                                     handleError({
//                                                         title: "Error",
//                                                         description:
//                                                             "Failed to process your acceptance. Please try again.",
//                                                         variant: "destructive",
//                                                     });
//                                                 }

//                                                 // Clear the input
//                                                 setUserInput("");
//                                             }}
//                                         >
//                                             {/* <Check className="mr-2 h-4 w-4" /> */}
//                                             Accept Summary
//                                         </Button>
//                                         <Button
//                                             variant="solid"
//                                             className="flex-1"
//                                             onClick={() => {
//                                                 setUserInput(
//                                                     "I'd like to refine some aspects of this agreement.",
//                                                 );
//                                                 handleSubmitMessage();
//                                             }}
//                                         >
//                                             {/* <Edit className="mr-2 h-4 w-4" /> */}
//                                             Refine Details
//                                         </Button>
//                                     </div>
//                                 )}

//                                 {/* Input Area */}
//                                 {(!summaryPresented ||
//                                     (summaryPresented && !finalizeSummary)) && (
//                                         <div className="flex gap-2">
//                                             <textarea
//                                                 value={userInput}
//                                                 onChange={(e) => setUserInput(e.target.value)}
//                                                 placeholder="Share your thoughts..."
//                                                 className="flex-1"
//                                                 onKeyDown={(e) => {
//                                                     if (e.key === "Enter" && !e.shiftKey) {
//                                                         e.preventDefault();
//                                                         handleSubmitMessage();
//                                                     }
//                                                 }}
//                                             />
//                                             <Button
//                                                 onClick={handleSubmitMessage}
//                                                 disabled={
//                                                     analyzeRoleMutation.isPending || !userInput.trim()
//                                                 }
//                                             >
//                                                 {analyzeRoleMutation.isPending ? (
//                                                     <Loading className="h-4 w-4 animate-spin" />
//                                                 ) : (
//                                                     <MessageSquare />
//                                                 )}

//                                             </Button>
//                                         </div>
//                                     )}

//                                 {showForm && finalizeSummary && (
//                                     <div className="pt-4">
//                                         <Alert className="mb-6">
//                                             <div>Review Your Agreement</div>
//                                             <div>
//                                                 You've accepted the role summary. Please complete the
//                                                 following details to finalize your agreement.
//                                             </div>
//                                         </Alert>
//                                         <FormContainer>
//                                             <div className="bg-muted/40 p-4 rounded-lg mb-4">
//                                                 <h3 className="font-medium mb-2">Role Summary</h3>
//                                                 <p className="mb-2">
//                                                     <strong>Role:</strong> {suggestions.role}
//                                                 </p>
//                                                 <p className="mb-2">
//                                                     <strong>Experience:</strong> {suggestions.experience}
//                                                 </p>
//                                                 <p className="mb-2">
//                                                     <strong>Location:</strong> {suggestions.location || "Remote"}
//                                                 </p>
//                                                 <p className="mb-2">
//                                                     <strong>Market Rate:</strong> ${suggestions.marketRate}/month
//                                                 </p>
//                                                 <p className="mb-1">
//                                                     <strong>Responsibilities:</strong>
//                                                 </p>
//                                                 <ul className="list-disc pl-6">
//                                                     {suggestions.responsibilities?.map((resp, i) => (
//                                                         <li key={i}>{resp}</li>
//                                                     ))}
//                                                 </ul>
//                                             </div>

//                                             {/* The Form */}
//                                             <div className="space-y-6">
//                                                 <FormItem
//                                                     label="Weekly Commitment (hours)"
//                                                     asterisk
//                                                     invalid={
//                                                         !!formik.touched.commitmentLevel &&
//                                                         !!formik.errors.commitmentLevel
//                                                     }
//                                                     errorMessage={formik.errors.commitmentLevel}
//                                                 >
//                                                     <Input
//                                                         type="number"
//                                                         name="commitmentLevel"
//                                                         min={1}
//                                                         max={40}
//                                                         value={formik.values.commitmentLevel || ""}
//                                                         onChange={formik.handleChange}
//                                                         onBlur={formik.handleBlur}
//                                                         invalid={
//                                                             !!formik.touched.commitmentLevel &&
//                                                             !!formik.errors.commitmentLevel
//                                                         }
//                                                     />
//                                                 </FormItem>

//                                                 <FormItem
//                                                     label="How much do you need monthly to sustain yourself? (USD)"
//                                                     asterisk
//                                                     invalid={!!formik.touched.fiatAmount && !!formik.errors.fiatAmount}
//                                                     errorMessage={formik.errors.fiatAmount}
//                                                 >
//                                                     <Input
//                                                         type="number"
//                                                         name="fiatAmount"
//                                                         value={formik.values.fiatAmount || ""}
//                                                         onChange={formik.handleChange}
//                                                         onBlur={formik.handleBlur}
//                                                         invalid={!!formik.touched.fiatAmount && !!formik.errors.fiatAmount}
//                                                     />
//                                                 </FormItem>

//                                                 <FormItem
//                                                     label="Your Name"
//                                                     asterisk
//                                                     invalid={!!formik.touched.username && !!formik.errors.username}
//                                                     errorMessage={formik.errors.username}
//                                                 >
//                                                     <Input
//                                                         name="username"
//                                                         placeholder="Enter your full name"
//                                                         value={formik.values.username}
//                                                         onChange={formik.handleChange}
//                                                         onBlur={formik.handleBlur}
//                                                         invalid={!!formik.touched.username && !!formik.errors.username}
//                                                     />
//                                                 </FormItem>

//                                                 <div className="space-y-4">
//                                                     <Button
//                                                         type="button"
//                                                         onClick={() => {
//                                                             if (!formik.isValid) {
//                                                                 // show toasts for top‐level errors
//                                                                 if (formik.errors.username) {
//                                                                     handleErrorMessage({
//                                                                         title: "Missing information",
//                                                                         description: formik.errors.username,
//                                                                         variant: "destructive",
//                                                                     });
//                                                                 }
//                                                                 if (formik.errors.commitmentLevel) {
//                                                                     handleErrorMessage({
//                                                                         title: "Invalid commitment",
//                                                                         description: formik.errors.commitmentLevel,
//                                                                         variant: "destructive",
//                                                                     });
//                                                                 }
//                                                                 return;
//                                                             }
//                                                             formik.handleSubmit();
//                                                         }}
//                                                         disabled={createAgreementMutation.isPending}
//                                                         className="w-full"
//                                                     >
//                                                         {createAgreementMutation.isPending && (
//                                                             <Loading className="mr-2 h-4 w-4 animate-spin" />
//                                                         )}
//                                                         Create Agreement
//                                                     </Button>

//                                                     <div className="text-center text-xs text-muted-foreground">
//                                                         Having trouble? Make sure all fields are filled out correctly.
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </FormContainer>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default AgreementAssistant;